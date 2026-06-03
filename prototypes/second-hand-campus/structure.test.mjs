import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const indexHtml = readFileSync(join(root, "index.html"), "utf8");

const expectedScripts = [
  "scripts/mock-data.js",
  "scripts/state-and-utils.js",
  "scripts/ui-components.js",
  "scripts/router-actions.js",
  "scripts/mini-pages.js",
  "scripts/seller-pages.js",
  "scripts/admin-pages.js",
  "scripts/bootstrap.js"
];

for (const scriptPath of expectedScripts) {
  assert.match(indexHtml, new RegExp(`<script src="./${scriptPath}\\?v=20260531-split"></script>`), `${scriptPath} should be loaded by index.html`);
  assert.ok(statSync(join(root, scriptPath)).isFile(), `${scriptPath} should exist`);
}

assert.doesNotMatch(indexHtml, /<script src="\.\/app\.js/, "index.html should not load the old monolithic app.js");

const oldApp = readFileSync(join(root, "app.js"), "utf8");
assert.match(oldApp, /拆分后的源码位于 \.\/scripts\//, "app.js should point maintainers to the split source files");
