// Resolve bundled logo assets at build time. Files live in ./img/<teamId>.<ext>
// (downloaded by scripts/download-logos.mjs). Returns {} cleanly when none are present yet.
const modules = import.meta.glob("./img/*.{png,svg,webp}", {
  eager: true,
  import: "default",
});

export const LOGOS: Record<string, string> = {};
for (const [path, url] of Object.entries(modules)) {
  const file = path.split("/").pop() ?? "";
  const id = file.replace(/\.(png|svg|webp)$/i, "");
  LOGOS[id] = url as string;
}
