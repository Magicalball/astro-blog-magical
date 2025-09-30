// Frontmatter validation and date utilities

export interface Frontmatter {
  title: string;
  author: string;
  pubDate: string; // expected format: YYYY-MM-DD
  tags?: string[];
  description?: string;
  coverImage?: string; // optional absolute path under public or full URL
}

const DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isValidYYYYMMDD(dateStr: string): boolean {
  const match = DATE_REGEX.exec(dateStr);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  // Construct UTC date and verify components (avoid timezone drift)
  const utc = new Date(Date.UTC(year, month - 1, day));
  return (
    utc.getUTCFullYear() === year &&
    utc.getUTCMonth() === month - 1 &&
    utc.getUTCDate() === day
  );
}

export function parseYYYYMMDDToUTC(dateStr: string): Date {
  if (!isValidYYYYMMDD(dateStr)) {
    throw new Error(`Invalid pubDate format (expected YYYY-MM-DD): ${dateStr}`);
  }
  const [y, m, d] = dateStr.split("-").map((v) => Number(v));
  return new Date(Date.UTC(y, m - 1, d));
}

export function getComparableUtcTime(dateStr: string): number {
  return parseYYYYMMDDToUTC(dateStr).getTime();
}

const DEFAULT_AUTHOR = "Magicalball";

export function validateFrontmatter(data: any): Frontmatter {
  if (!data || typeof data !== "object") {
    throw new Error("frontmatter is missing or not an object");
  }
  const { title, author, pubDate, tags, description, coverImage } = data;
  if (typeof title !== "string" || title.trim() === "") {
    throw new Error("frontmatter.title must be a non-empty string");
  }
  // author 可缺省，回落到站点默认作者
  const safeAuthor = (typeof author === "string" && author.trim() !== "") ? author : DEFAULT_AUTHOR;
  if (typeof pubDate !== "string" || !isValidYYYYMMDD(pubDate)) {
    throw new Error(
      `frontmatter.pubDate must be a string in YYYY-MM-DD format: ${pubDate}`
    );
  }
  if (tags !== undefined) {
    if (!Array.isArray(tags) || !tags.every((t) => typeof t === "string")) {
      throw new Error("frontmatter.tags must be an array of strings if provided");
    }
  }
  if (description !== undefined && typeof description !== "string") {
    throw new Error("frontmatter.description must be a string if provided");
  }
  if (coverImage !== undefined && typeof coverImage !== "string") {
    throw new Error("frontmatter.coverImage must be a string if provided");
  }
  return {
    title,
    author: safeAuthor,
    pubDate,
    tags: tags || [],
    description,
    coverImage,
  };
}


