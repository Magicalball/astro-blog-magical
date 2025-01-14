import rss, { pagesGlobToRssItems } from '@astrojs/rss'

export async function GET(context) {
  return rss({
    title: 'Magicalball | Blog',
    description: 'Sharing some articles in the Magical House',
    site: 'http://localhost:4321/',
    items: await pagesGlobToRssItems(import.meta.glob('./**/*.md')),
    customData: `<language>cn</language>`,
  })
}
