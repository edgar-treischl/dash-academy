import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { after, test } from "node:test";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToReadableStream } from "react-dom/server";

const server = await createServer({
  server: { middlewareMode: true },
});
after(() => server.close());

const { getLesson } = await server.ssrLoadModule("/src/utils/lessonLoader.ts");
const { modules } = await server.ssrLoadModule("/src/data/lessonMetadata.ts");
const { parseMarkdownToBlocks } = await server.ssrLoadModule("/src/utils/markdownParser.ts");

test("loads every registered lesson from its JSON and Markdown files", async () => {
  for (const module of modules) {
    for (const lessonId of module.lessonIds) {
      const directory = new URL(
        `../src/lessons/${module.id}/${lessonId}/`,
        import.meta.url
      );
      const metadata = JSON.parse(
        await readFile(new URL("lesson.json", directory), "utf8")
      );
      const content = await readFile(new URL("content.md", directory), "utf8");

      assert.ok(content.trim(), `${lessonId} must have content`);
      const lesson = await getLesson(module.id, lessonId);
      assert.ok(lesson, `${lessonId} must load`);
      const { content: blocks, moduleId, ...loadedMetadata } = lesson;
      assert.deepEqual(loadedMetadata, metadata);
      assert.equal(moduleId, module.id);
      if (!content.includes("::: component")) {
        assert.deepEqual(blocks, [
          { id: `${lessonId}-markdown`, type: "markdown", content },
        ]);
      }
    }
  }
});

test("renders the embedded SalesChart from lesson 1 with its Markdown props", async () => {
  const lesson = await getLesson("foundations", "lesson-1");
  assert.ok(lesson);
  assert.deepEqual(lesson.content.map((block) => block.type), [
    "markdown", "react-component", "markdown",
  ]);
  const component = lesson.content[1];
  assert.equal(component.componentName, "SalesChart");
  assert.deepEqual(component.props.data, [
    { month: "Januar", sales: 12000 },
    { month: "Februar", sales: 15000 },
    { month: "März", sales: 18000 },
  ]);
  assert.match(lesson.content[2].content, /Von intuitiven/);

  const { default: LessonRenderer } = await server.ssrLoadModule(
    "/src/features/lessons/LessonRenderer.tsx"
  );
  const stream = await renderToReadableStream(
    createElement(LessonRenderer, { blocks: [component] })
  );
  await stream.allReady;
  const html = await new Response(stream).text();
  assert.ok(html.includes(component.props.title));
  assert.match(html, /Januar/);
  assert.match(html, /18,000/);
});

test("keeps component directives literal inside fenced code examples", () => {
  for (const fence of ["```", "~~~"]) {
    const markdown = `${fence}markdown\n::: component SalesChart\n{}\n:::\n${fence}\n`;
    assert.deepEqual(parseMarkdownToBlocks(markdown, "example"), [
      { id: "example-markdown", type: "markdown", content: markdown },
    ]);
  }
});

test("preserves order for multiple components and supports omitted props and CRLF", () => {
  const blocks = parseMarkdownToBlocks(
    "# Before\r\n\r\n::: component SalesChart\r\n:::\r\n\r\nBetween\r\n\r\n::: component SalesChart\r\n{\"title\":\"Second\"}\r\n:::\r\n\r\nAfter",
    "example"
  );
  assert.deepEqual(blocks.map((block) => block.type), [
    "markdown", "react-component", "markdown", "react-component", "markdown",
  ]);
  assert.deepEqual(blocks[1].props, {});
  assert.deepEqual(blocks[3].props, { title: "Second" });
  assert.equal(new Set(blocks.map((block) => block.id)).size, blocks.length);
});

test("rejects malformed or unclosed component directives", () => {
  for (const json of ["null", "[]", "123", "\"text\"", "{invalid}"]) {
    assert.throws(() => parseMarkdownToBlocks(
      `::: component SalesChart\n${json}\n:::\n`, "example"
    ));
  }
  assert.throws(
    () => parseMarkdownToBlocks("::: component SalesChart\n{}", "example"),
    /Missing closing :::/
  );
});

test("shows an explicit error for unregistered component names", async () => {
  const { default: LessonRenderer } = await server.ssrLoadModule(
    "/src/features/lessons/LessonRenderer.tsx"
  );
  const blocks = parseMarkdownToBlocks("::: component UnknownChart\n:::\n", "example");
  const stream = await renderToReadableStream(createElement(LessonRenderer, { blocks }));
  const html = await new Response(stream).text();
  assert.match(html, /role="alert"/);
  assert.match(html, /UnknownChart/);
  assert.match(html, /not found/);
});

test("reports missing lesson files instead of returning empty content", async (t) => {
  const errors = t.mock.method(console, "error", () => {});

  assert.equal(await getLesson("foundations", "missing-lesson"), null);
  assert.equal(errors.mock.callCount(), 1);
  assert.match(errors.mock.calls[0].arguments[1].message, /Missing lesson\.json or content\.md/);
});
