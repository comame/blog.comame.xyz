import { config } from './config'
import { toString } from './date'
import { Entry } from './entry'

export function createSitemap(entries: Entry[]) {
    const entryUrls = entries.map(entry => `https://${ config.hostname }/entries/${toString(entry.date)}/${entry.entry}`).sort()

    const tagSet = new Set()
    for (const entry of entries) {
        for (const tag of entry.tags) tagSet.add(tag)
    }
    const tags = Array.from(tagSet).map(tag => `https://${ config.hostname }/tags/${tag}`).sort()

    return [ `https://${ config.hostname }/`, ...entryUrls, ...tags ].join('\n')
}
