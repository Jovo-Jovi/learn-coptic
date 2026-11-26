import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const repoRoot = path.resolve(import.meta.dirname, "..");
const componentsRoot = path.join(repoRoot, "src", "components");
const appRoot = path.join(repoRoot, "src", "app");

/** The break this catches: a file under src/lib or src/data imports the UI. */
test("src/lib and src/data do not import the UI", () => {
  const violations: string[] = [];
  for (const file of sourceFiles(path.join(repoRoot, "src", "lib"))) {
    collectViolations(file, violations);
  }
  for (const file of sourceFiles(path.join(repoRoot, "src", "data"))) {
    collectViolations(file, violations);
  }
  assert.deepEqual(violations, [], violations.join("\n"));
});

function sourceFiles(directory: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      found.push(...sourceFiles(fullPath));
    } else if (
      entry.isFile() &&
      (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))
    ) {
      found.push(fullPath);
    }
  }
  return found;
}

function collectViolations(file: string, violations: string[]) {
  const source = stripComments(readFileSync(file, "utf8"));
  for (const specifier of importSpecifiers(source)) {
    if (importsUi(file, specifier)) {
      violations.push(`${path.relative(repoRoot, file)} imports ${specifier}`);
    }
  }
}

function importsUi(file: string, specifier: string): boolean {
  if (specifier.startsWith("@/components") || specifier.startsWith("@/app")) {
    return true;
  }
  if (!specifier.startsWith(".")) {
    return false;
  }
  const resolved = path.resolve(path.dirname(file), specifier);
  return isInside(componentsRoot, resolved) || isInside(appRoot, resolved);
}

function isInside(parent: string, child: string): boolean {
  const relative = path.relative(parent, child);
  return (
    relative === "" ||
    (!relative.startsWith("..") && !path.isAbsolute(relative))
  );
}

function importSpecifiers(source: string): string[] {
  const specifiers: string[] = [];
  const patterns = [
    /\bfrom\s+["']([^"']+)["']/g,
    /\bimport\s+["']([^"']+)["']/g,
    /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g,
  ];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      const specifier = match[1];
      if (specifier) {
        specifiers.push(specifier);
      }
    }
  }
  return specifiers;
}

function stripComments(source: string): string {
  let out = "";
  let index = 0;
  while (index < source.length) {
    const current = source[index];
    const next = source[index + 1];
    if (current === "/" && next === "/") {
      index += 2;
      while (index < source.length && source[index] !== "\n") {
        index += 1;
      }
      continue;
    }
    if (current === "/" && next === "*") {
      index += 2;
      while (
        index < source.length &&
        !(source[index] === "*" && source[index + 1] === "/")
      ) {
        index += 1;
      }
      index += 2;
      continue;
    }
    if (current === '"' || current === "'" || current === "`") {
      out += current;
      index += 1;
      while (index < source.length) {
        const quoted = source[index];
        if (quoted === "\\") {
          out += quoted + (source[index + 1] ?? "");
          index += 2;
          continue;
        }
        out += quoted;
        index += 1;
        if (quoted === current) {
          break;
        }
      }
      continue;
    }
    out += current;
    index += 1;
  }
  return out;
}
