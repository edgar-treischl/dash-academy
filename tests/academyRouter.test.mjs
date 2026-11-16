import assert from "node:assert/strict";
import { after, test } from "node:test";
import { createElement } from "react";
import { renderToReadableStream } from "react-dom/server";
import { createMemoryRouter } from "react-router-dom";
import { createServer } from "vite";

const server = await createServer({
  server: { middlewareMode: true },
});
after(() => server.close());

test("renders the federated entry without a browser URL or standalone basename", async () => {
  const { default: AcademyApp } = await server.ssrLoadModule("/src/AcademyApp.tsx");
  const stream = await renderToReadableStream(createElement(AcademyApp));
  await stream.allReady;
  const html = await new Response(stream).text();

  assert.match(html, /Fortbildungsinhalte für Dash/);
  assert.match(html, /href="\/learning-path"/);
  assert.doesNotMatch(html, /href="\/dash-academy\//);
});

test("supports internal navigation with the shared Academy routes", async () => {
  const { routes } = await server.ssrLoadModule("/src/app/router.tsx");
  const router = createMemoryRouter(routes);

  try {
    assert.equal(router.state.location.pathname, "/");
    await router.navigate("/learning-path");
    assert.equal(router.state.location.pathname, "/learning-path");
    assert.equal(router.state.errors, null);
    await router.navigate("/modules/foundations");
    assert.equal(router.state.location.pathname, "/modules/foundations");
    assert.equal(router.state.errors, null);
  } finally {
    router.dispose();
  }
});
