/** Canonicalize free text for matching: strip accents/punctuation, lowercase, collapse spaces. */
export function normalize(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics (Montréal -> Montreal)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ") // punctuation/apostrophes/hyphens -> space
    .trim()
    .replace(/\s+/g, " ");
}

/** Normalized whitespace-separated tokens (empty array for blank input). */
export function tokens(s: string): string[] {
  const n = normalize(s);
  return n ? n.split(" ") : [];
}
