import { Marked, type Token } from "marked";
import DOMPurify from "dompurify";
import type { ContentBlock } from "../types/learning";

interface ComponentToken {
  type: "lesson-component";
  raw: string;
  componentName: string;
  props: Record<string, unknown>;
}

function isComponentToken(token: Token): token is ComponentToken {
  return token.type === "lesson-component";
}

function isProps(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const lessonMarkdown = new Marked({
  extensions: [{
    name: "lesson-component",
    level: "block",
    start: (source) => source.match(/^ {0,3}:::[ \t]+component\b/m)?.index,
    tokenizer(source): ComponentToken | undefined {
      const opening = /^ {0,3}:::[ \t]+component[ \t]+([A-Z]\w*)[ \t]*\n/.exec(source);
      if (!opening) return;

      const body = source.slice(opening[0].length);
      const closing = /^ {0,3}:::[ \t]*(?:\n|$)/m.exec(body);
      const componentName = opening[1];
      if (!closing) {
        throw new Error(`Missing closing ::: for component "${componentName}"`);
      }

      const json = body.slice(0, closing.index).trim();
      const props: unknown = json ? JSON.parse(json) : {};
      if (!isProps(props)) {
        throw new Error(`Props for component "${componentName}" must be a JSON object`);
      }

      return {
        type: "lesson-component",
        raw: source.slice(0, opening[0].length + closing.index + closing[0].length),
        componentName,
        props,
      };
    },
  }],
});

/**
 * Sanitize HTML to prevent XSS attacks.
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "br",
      "hr",
      "strong",
      "em",
      "u",
      "ul",
      "ol",
      "li",
      "a",
      "blockquote",
      "code",
      "pre",
      "table",
      "thead",
      "tbody",
      "tr",
      "td",
      "th",
      "img",
    ],
    ALLOWED_ATTR: ["href", "title", "alt", "src"],
  });
}

export function parseMarkdownToBlocks(
  markdown: string,
  lessonId: string
): ContentBlock[] {
  const tokens = lessonMarkdown.lexer(markdown);
  if (!tokens.some(isComponentToken)) {
    return [{ id: `${lessonId}-markdown`, type: "markdown", content: markdown }];
  }

  const blocks: ContentBlock[] = [];
  let content = "";
  const flushMarkdown = () => {
    if (content.trim()) {
      blocks.push({
        id: `${lessonId}-markdown-${blocks.length}`,
        type: "markdown",
        content,
      });
    }
    content = "";
  };

  for (const token of tokens) {
    if (isComponentToken(token)) {
      flushMarkdown();
      blocks.push({
        id: `${lessonId}-component-${blocks.length}`,
        type: "react-component",
        componentName: token.componentName,
        props: token.props,
      });
    } else {
      content += token.raw;
    }
  }
  flushMarkdown();
  return blocks;
}
