import rss, { pagesGlobToRssItems } from '@astrojs/rss'

export async function GET(context) {
  return rss({
    title: 'Magicalball | Blog',
    description: 'Sharing some articles in the Magical House',
    site: context.site || 'https://magicalball.top',
    items: await pagesGlobToRssItems(import.meta.glob('./**/*.md')),
    customData: `<language>cn</language>`,
  })
}
