// 文章数据获取工具函数
export interface PostData {
  url: string;
  title: string;
  pubDate: string;
  author: string;
  tags: string[];
  description?: string;
}

// 从 Astro.glob 结果转换为标准化的文章数据
export function normalizePost(post: any): PostData {
  return {
    url: post.url,
    title: post.frontmatter.title,
    pubDate: post.frontmatter.pubDate,
    author: post.frontmatter.author,
    tags: post.frontmatter.tags || [],
    description: post.frontmatter.description
  };
}

// 注意：getAllPosts, getPaginatedPosts, getPostsByTag 函数已删除
// 因为当前项目中没有使用这些函数，直接在各页面中使用 Astro.glob

// 虚拟滚动配置
export const VIRTUAL_LIST_CONFIG = {
  itemHeight: 120, // 每个文章项的预估高度
  containerHeight: 600, // 容器高度
  bufferSize: 3, // 缓冲区大小 (优化: 从5减少到3)
  pageSize: 20 // 每页加载的文章数量
};
