
import { Suspense, createElement, useMemo } from "react";
import { marked } from "marked";
import type { ContentBlock } from "../types/learning";
import { getComponent } from "./componentRegistry";
import { sanitizeHtml } from "../utils/markdownParser";

interface Props {
  blocks: ContentBlock[];
}

function ComponentLoader({
  componentName,
  props,
  fallback,
}: {
  componentName: string;
  props?: Record<string, unknown>;
  fallback?: string;
}) {
  const Component = getComponent(componentName);

  if (!Component) {
    return (
      <div className="learning-error" role="alert">
        {fallback || `Component "${componentName}" not found`}
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="learning-loading">Loading component...</div>}>
      {createElement(Component, props || {})}
    </Suspense>
  );
}

function MarkdownBlock({ content, components }: { content: string; components?: Array<{ componentName: string; props?: Record<string, unknown> }> }) {
  // Memoize the rendered HTML to avoid re-parsing on every render
  const htmlContent = useMemo(() => {
    // Use marked's synchronous rendering
    const html = marked.parse(content, { async: false }) as string;
    return sanitizeHtml(html);
  }, [content]);

  return (
    <section className="learning-markdown-section">
      <div
        className="learning-markdown-content"
        dangerouslySetInnerHTML={{
          __html: htmlContent,
        }}
      />

      {components && components.length > 0 && (
        <div className="learning-components">
          {components.map((comp, index) => (
            <ComponentLoader
              key={index}
              componentName={comp.componentName}
              props={comp.props}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default function LessonRenderer({ blocks }: Props) {
  return (
    <div className="learning-lesson-content">
      {blocks.map((block) => {
        switch (block.type) {
          case "text":
            return (
              <section key={block.id}>
                {block.heading && (
                  <h2 className="learning-section-title">
                    {block.heading}
                  </h2>
                )}

                {block.image && (
                  <img
                    src={block.image}
                    alt={block.imageAlt || block.heading || ""}
                    className="learning-content-image"
                  />
                )}

                <p className="learning-prose">
                  {block.content}
                </p>
              </section>
            );

          case "markdown":
            return (
              <MarkdownBlock
                key={block.id}
                content={block.content}
                components={block.components}
              />
            );

          case "react-component":
            return (
              <section key={block.id} className="learning-component-section">
                <ComponentLoader
                  componentName={block.componentName}
                  props={block.props}
                  fallback={block.fallback}
                />
              </section>
            );

          case "callout":
            return (
              <div
                key={block.id}
                className={`learning-callout learning-callout--${
                  block.style || "info"
                }`}
              >
                {block.content}
              </div>
            );

          case "quiz":
            return (
              <section
                key={block.id}
                className="learning-card"
              >
                <h3>
                  {block.question}
                </h3>

                <ul className="learning-quiz-answers">
                  {block.answers.map((answer, index) => (
                    <li key={index}>
                      {answer}
                    </li>
                  ))}
                </ul>

                {block.explanation && (
                  <p className="learning-quiz-explanation">
                    {block.explanation}
                  </p>
                )}

                <p className="learning-card-meta">
                  Quiz interaction will be implemented later.
                </p>
              </section>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
