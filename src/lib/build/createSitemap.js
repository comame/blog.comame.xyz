module.exports = () => {
    const entriesJson = require('../../../entries/entries.json')

    const entries = entriesJson.map(entry => `https://blog.comame.xyz/entries/${entry.date}/${entry.entry}`)

    const tagSet = new Set()
    for (const entry of entriesJson) {
        for (const tag of entry.tags) tagSet.add(tag)
    }
    const tags = Array.from(tagSet).map(tag => `https://blog.comame.xyz/tags/${tag}`)

    return [ 'https://blog.comame.xyz/', ...entries, ...tags ].join('\n')
}
