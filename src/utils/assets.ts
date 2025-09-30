// Helpers for per-article assets organization

// Convention:
// - Optional frontmatter.coverImage: absolute path under public (e.g. "/images/..." ) or full URL
// - Optional per-article assets directory hint: if article filename is "posts/221013.mdx",
//   images can be placed under "/images/posts/221013/" (not enforced, only recommended)

export function resolveCoverImage(coverImage?: string): string | undefined {
  if (!coverImage) return undefined;
  // Allow absolute paths or full URLs only to avoid broken relative references in static site
  if (coverImage.startsWith("http://") || coverImage.startsWith("https://")) {
    return coverImage;
  }
  if (coverImage.startsWith("/")) {
    return coverImage;
  }
  // Fallback: ensure leading slash so it maps to public dir at runtime
  return `/${coverImage}`;
}

export function suggestPostAssetsDir(postBasename: string): string {
  // Given filename like "221013.mdx" or "221013.md"
  const base = postBasename.replace(/\.(md|mdx)$/i, "");
  return `/images/posts/${base}/`;
}


