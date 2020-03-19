const ALL = 'ALL' in process.env
const BLOG_HOST = process.env.BLOG_HOST || 'http://localhost'

const buildArticles = require('./build/script/buildArticles')
const buildMarkdown = require('./build/script/buildMarkdown')
const copyAssets = require('./build/script/copyAssets')
const createFeed = require('./build/script/createFeed')
const createSiteMap = require('./build/script/createSitemap')

const entries = require('./archives/entries.json')

if (ALL) main()

async function main() {
    setTimeout(() => {
        console.error('TLE')
        process.exit(1)
    }, 3 * 60 * 1000)

    console.log(`BLOG_HOST: ${BLOG_HOST}`)

    const crawledPageSets = new Set()

    await buildMarkdown().catch(handleError)
    await copyAssets().catch(handleError)

    await buildArticles(crawledPageSets, BLOG_HOST).catch(handleError)

    await createSiteMap(Array.from(crawledPageSets.values())).catch(handleError)
    await createFeed(entries).catch(handleError)

    process.exit(0)
}

function handleError(err) {
    console.error(err)
    process.exit(1)
}

module.exports = {
    buildMarkdown,
    copyAssets,
    createSiteMap,
    createFeed,
    buildArticles
}
