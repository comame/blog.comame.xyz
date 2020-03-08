const buildDir = '/docs'

const BLOG_HOST = process.env.BLOG_HOST || 'http://localhost'

const puppeteer = require('puppeteer')
const fs = require('fs').promises
const entries = require('./archives/entries.json')

async function createSiteMap(paths) {
    await fs.writeFile(__dirname + buildDir + '/sitemap.txt', '')
    for (const path of paths) {
        await fs.appendFile(__dirname + buildDir + '/sitemap.txt', 'https://blog.comame.xyz/' + path + '\n')
    }
}

async function createFeed() {
    const items = []

    const base = (items) => `
    <? xml version='1.0' ?>
    <rss version='2.0'>
    <channel>
      <title>blog.comame.xyz</title>
      <link>https://blog.comame.xyz</link>
      ${items}
    </channel>
    </rss>
    `

    const item = (title, link, pubDate) => `
    <item>
      <title>${title}</title>
      <link>${link}</link>
      <pubDate>${pubDate}</pubDate>
    </item>
    `

    for (const entry of entries) {
        const title = entry.title
        const dateString = entry.date
        const link = 'https://blog.comame.xyz/entries/' + dateString + '/' + entry.entry
        const [ year, month, day ] = [ ...dateString.split('-').map(it => Number.parseInt(it)) ]
        const pubDate = new Date(year, month - 1, day).toUTCString()
        items.push(item(title, link, pubDate))
    }

    const rss = base(items.join(''))

    await fs.writeFile(__dirname + buildDir + '/feed.xml', rss)
}

async function savePage(path, content, overwrite = true) {
    const dirName = path.split('/').slice(0, -1).join('/')
    const fileName = path.split('/').slice(-1)[0] || 'index.html'

    const dirStat = await fs.stat(__dirname + buildDir + '/' + dirName).catch(err => {
        // do nothing
    })
    if (!dirStat) {
        await fs.mkdir(__dirname + buildDir + '/'+ dirName, { recursive: true })
    }

    const fileStat = await fs.stat(__dirname + buildDir + '/' + dirName + '/' + fileName).catch(err => {
        // do nothing
    })

    if (!fileStat || (fileStat && overwrite)) {
        await fs.writeFile(__dirname + buildDir + '/' + dirName + '/' + fileName, content)
        console.log(`Page saved: ${path}`)
    }
}

async function copyAssets() {
    const copy = async (dirname, files) => {
        for (const file of files) {
            const stats = await fs.stat(__dirname + '/assets/' + dirname + '/' + file)
            if (stats.isDirectory()) {
                await copy(dirname + '/' + file, await fs.readdir(__dirname + '/assets/' + dirname + '/' + file))
            } else {
                const stat = await fs.stat(__dirname + buildDir + '/assets/' + dirname).catch(() => {})
                if (!stat) await fs.mkdir(__dirname + buildDir + '/assets/' + dirname, { recursive: true })
                await fs.copyFile(
                    __dirname + '/assets/' + dirname + '/' + file,
                    __dirname + buildDir + '/assets/' + dirname + '/' + file
                )
                console.log(`Asset copied: ${dirname + '/' + file}`)
            }
        }
    }

    await copy('', await fs.readdir(__dirname + '/assets'))
}

async function crawl(path, page, crawledPathSet) {
    if (crawledPathSet.has(path)) return
    crawledPathSet.add(path)

    await page.goto(BLOG_HOST + '/' + path)
    await page.$$eval('script:not([not-remove])', elements => {
        for (const element of elements) {
            element.parentNode.removeChild(element)
        }
    })

    const notfound = await page.$('#c-notfound')

    const content = await page.content()
    if (notfound) {
        crawledPathSet.delete(path)
    } else {
        await savePage(path, content)
    }

    const crawlLinks = await page.$$eval('a', (elements, host) => {
        return elements.filter(el => el.href.startsWith(host)).map(el => el.href)
    }, BLOG_HOST)

    for (const crawlLink of crawlLinks) {
        await crawl(crawlLink.slice(BLOG_HOST.length + 1), page, crawledPathSet)
    }
}

async function main() {
    if (!BLOG_HOST) {
        console.error('Set BLOG_HOST environment variable.')
        return
    }

    await copyAssets()

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    })
    const page = await browser.newPage()

    let hasError = false

    const crawledPageSets = new Set()
    try {
        await crawl('', page, crawledPageSets)
    } catch (err) {
        console.error(err)
        hasError = true
    } finally {
        await browser.close()
    }

    await createSiteMap(Array.from(crawledPageSets.values())).catch(err => {
        console.error(err)
        hasError = true
    })
    console.log('Sitemap creted')

    await createFeed().catch(err => {
        console.error(err)
        hasError = true
    })
    console.log('RSS feed created')

    if (hasError) process.exit(1)
}

main()
