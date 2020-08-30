module.exports = () => {
    const archives = require('../../../archives/entries.json')

    const entries = archives.map(entry => `https://blog.comame.xyz/entries/${entry.date}/${entry.date}.html`)

    const tagSet = new Set()
    for (const entry of archives) {
        for (const tag of entry.tags) tagSet.add(tag)
    }
    const tags = Array.from(tagSet).map(tag => `https://blog.comame.xyz/tags/${tag}.html`)

    return [ 'https://blog.comame.xyz/', ...entries, ...tags ].join('\n')
}
