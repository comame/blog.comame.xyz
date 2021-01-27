import { Entry } from './entry'

export function createSitemap(entries: Entry[]) {
    const entryUrls = entries.map(entry => `https://blog.comame.xyz/entries/${entry.date}/${entry.entry}`).sort()

    const tagSet = new Set()
    for (const entry of entries) {
        for (const tag of entry.tags) tagSet.add(tag)
    }
    const tags = Array.from(tagSet).map(tag => `https://blog.comame.xyz/tags/${tag}`).sort()

    return [ 'https://blog.comame.xyz/', ...entryUrls, ...tags ].join('\n')
}
