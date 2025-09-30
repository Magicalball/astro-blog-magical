import rss from '@astrojs/rss'
import { normalizePost } from '../utils/getPosts'
import { getComparableUtcTime } from '../utils/validation'

export async function GET(context) {
  const globResult = import.meta.glob('./**/*.{md,mdx}')
  const modules = await Promise.all(Object.values(globResult).map((fn) => fn()))
  const posts = modules.map((m) => normalizePost(m))
  const sorted = posts
    .slice()
    .sort((a, b) => getComparableUtcTime(b.pubDate) - getComparableUtcTime(a.pubDate))

  return rss({
    title: 'Magicalball | Blog',
    description: 'Sharing some articles in the Magical House',
    site: context.site || 'https://magicalball.top',
    items: sorted.map((p) => ({
      link: p.url,
      title: p.title,
      pubDate: new Date(p.pubDate),
      description: p.description,
    })),
    customData: `<language>cn</language>`,
  })
}
