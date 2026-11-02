/**
 * Copy check: every string must appear in the built page word for word.
 * Comparison is on visible text: tags removed, entities decoded, whitespace collapsed.
 * Nothing else is normalized (case, punctuation and word order must match).
 */

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
  ndash: "–",
  mdash: "—",
  hellip: "…",
  reg: "®",
};

export function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, body: string) => {
    if (body[0] === "#") {
      const code = body[1].toLowerCase() === "x" ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    return NAMED_ENTITIES[body.toLowerCase()] ?? match;
  });
}

export function collapseWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/** Visible text of a built page: scripts, styles and tags dropped, entities decoded. */
export function visibleText(html: string): string {
  const body = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ");
  return collapseWhitespace(decodeEntities(body));
}

/** Flatten any nested copy JSON (strings, arrays, objects) into its string values. */
export function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => collectStrings(v, out));
  else if (value && typeof value === "object") {
    for (const [key, v] of Object.entries(value)) {
      if (key.startsWith("_")) continue; // notes, not page copy
      collectStrings(v, out);
    }
  }
  return out;
}

export type CopyCheckResult = { ok: boolean; missing: string[] };

/** Which of the given strings do not appear in the page word for word. */
export function checkCopy(html: string, strings: readonly string[]): CopyCheckResult {
  const haystack = visibleText(html);
  const missing = strings
    .map((s) => collapseWhitespace(s))
    .filter((s) => s.length > 0 && !haystack.includes(s));
  return { ok: missing.length === 0, missing };
}

/** Throws with the list of missing strings. For use inside node:test. */
export function assertCopy(html: string, strings: readonly string[], label = "page"): void {
  const { ok, missing } = checkCopy(html, strings);
  if (!ok) {
    throw new Error(`Copy missing from ${label} (${missing.length}):\n- ${missing.join("\n- ")}`);
  }
}
