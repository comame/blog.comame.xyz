const buildDir = '/docs'

const BLOG_HOST = process.env.BLOG_HOST || 'http://localhost'
const ALL = 'ALL' in process.env

const puppeteer = require('puppeteer')
const md = require('marked')
const fs = require('fs').promises
const entries = require('./archives/entries.json')

if (ALL) main()

async function main() {
    setTimeout(() => {
        console.error('TLE')
        process.exit(1)
    }, 3 * 60 * 1000)

    const crawledPageSets = new Set()

    await buildMarkdown().catch(handleError)
    await copyAssets().catch(handleError)

    await buildArticles(crawledPageSets).catch(handleError)

    await createSiteMap(Array.from(crawledPageSets.values())).catch(handleError)
    await createFeed().catch(handleError)

    process.exit(0)
}

function handleError(err) {
    console.error(err)
    process.exit(1)
}

async function minifyCss(css) {
    return css
        .replace(/\/\*.*\*\//g, '')
        .split(/\n/g)
        .map(line =>
            line
                .replace(/^\s+/g, '')
                .replace(/\s+$/g, '')
        )
        .join('')

}

async function buildMarkdown() {
    const renderer = new md.Renderer()
    renderer.link = function(href, title, text) {
        if (
            href.startsWith('http://') ||
            href.startsWith('https://') ||
            href.startsWith('//')
        ) {
            return `<a href=${href} target='_blank' rel='noopener'>${text}</a>`
        } else {
            return `<a href=${href}>${text}</a>`
        }
    }

    const archiveDirs = await fs.readdir(__dirname + '/archives')
    for (const archiveDir of archiveDirs) {
        if (archiveDir == 'entries.json') continue
        const entryFilenames = await fs.readdir(__dirname + '/archives/' + archiveDir)
        for (const entryFilename of entryFilenames) {
            if (!entryFilename.endsWith('.md')) continue
            const markdown = await fs.readFile(__dirname + '/archives/' + archiveDir + '/' + entryFilename, {
                encoding: 'utf8'
            })
            const html = md(markdown, {
                headerIds: false,
                renderer
            })
            const htmlFilename = entryFilename.replace(/\.md$/, '.html')
            await fs.writeFile(__dirname + '/archives/' + archiveDir + '/' + htmlFilename, html)
            console.log(`Compiled ${archiveDir}/${entryFilename}`)
        }
    }
}

async function copyAssets() {
    const copy = async (dirname, files, index = false) => {
        for (const file of files) {
            const stats = await fs.stat(__dirname + '/assets/' + dirname + '/' + file)
            if (stats.isDirectory()) {
                const isIndex = file == '_index'
                await copy(dirname + '/' + file, await fs.readdir(__dirname + '/assets/' + dirname + '/' + file), isIndex)
            } else {
                const targetDirname =
                    index ?
                    __dirname + buildDir :
                    __dirname + buildDir + '/assets/' + dirname

                const stat = await fs.stat(targetDirname).catch(() => {})
                if (!stat) await fs.mkdir(targetDirname, { recursive: true })
                await fs.copyFile(
                    __dirname + '/assets/' + dirname + '/' + file,
                    targetDirname + '/' + file
                )
                console.log(`Asset copied: ${dirname + '/' + file}`)
            }
        }
    }

    await copy('', await fs.readdir(__dirname + '/assets'))
    console.log('Assets copied')
}

async function createSiteMap(paths) {
    await fs.writeFile(__dirname + buildDir + '/sitemap.txt', '')
    for (const path of paths) {
        await fs.appendFile(__dirname + buildDir + '/sitemap.txt', 'https://blog.comame.xyz/' + path + '\n')
    }
    console.log('Sitemap created')
}


async function createFeed() {
    const items = []

    const base = (updated, items) => `
    <?xml version='1.0'?>
    <feed xmlns='http://www.w3.org/2005/Atom'>
      <id>https://blog.comame.xyz/</id>
      <title>blog.comame.xyz</title>
      <link rel='alternate' href='https://blog.comame.xyz/' />
      <link rel='self' href='https://blog.comame.xyz/feed.xml' />
      <author><name>comame</name></author>
      <updated>${updated}</updated>

      ${items.join('')}
    </feed>
    `

    const item = (title, link, date, htmlContent) => `
    <entry>
      <title>${title}</title>
      <link rel='alternate' href='${link}' />
      <id>${link}</id>
      <updated>${date}T00:00:00Z</updated>
      <content type='html'>${htmlContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</content>
    </entry>
    `

    entries.sort((a, b) => {
        const [aYear, aMonth, aDay] = a.date.split('-').map(it => Number.parseInt(it))
        const [bYear, bMonth, bDay] = b.date.split('-').map(it => Number.parseInt(it))

        if (aYear != bYear) return bYear - aYear
        if (aMonth != bMonth) return bMonth - aMonth
        return bDay - aDay
    })

    for (const entry of entries) {
        const title = entry.title
        const date = entry.date
        const link = 'https://blog.comame.xyz/entries/' + date + '/' + entry.entry + '.html'

        const year = date.split('-')[0]
        const htmlContent = await fs.readFile(__dirname + '/archives/' + year + '/' + entry.entry + '.html', {
            encoding: 'utf8'
        })
        items.push(item(title, link, date, htmlContent))
    }

    const latestEntryDate = entries[0].date.split('-')
    const date = new Date(latestEntryDate[0], latestEntryDate[1] - 1, latestEntryDate[2])
    const updated =
        date.getFullYear() + '-' +
        (((date.getMonth() + 1) < 10) ? `0${date.getMonth() + 1}-` : `${date.getMonth() + 1}-`) +
        ((date.getDate() < 10) ? `0${date.getDate()}T` : `${date.getDate()}T`) +
        ((date.getHours() < 10) ? `0${date.getHours()}:` : `${date.getHours()}:`) +
        ((date.getMinutes() < 10) ? `0${date.getMinutes()}:` : `${date.getMinutes()}:`) +
        ((date.getSeconds() < 10) ? `0${date.getSeconds()}Z` : `${date.getSeconds()}Z`)

    const rss = base(updated, items).replace(/^\s+|\s+$/g,"");

    await fs.writeFile(__dirname + buildDir + '/feed.xml', rss)

    console.log('Feed created')
}

async function buildArticles(crawledPageSets) {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    })
    try {
        const page = await browser.newPage()
        await crawl('', page, crawledPageSets)
    } finally {
        await browser.close()
    }
}

async function crawl(path, page, crawledPathSet) {
    console.log(`Crawling /${path}`)

    if (crawledPathSet.has(path)) {
        console.log(`  skipped`)
        return
    }
    crawledPathSet.add(path)

    await page.goto(BLOG_HOST + '/' + path)

    await page.waitForSelector('meta[name=x-render-complete]')
    await page.$eval('meta[name=x-render-complete]', element => {
        element.parentNode.removeChild(element)
    })

    const styles = await page.$$eval('link[rel=stylesheet]', async (elements, hostname) => {
        const styles = []
        for (const element of elements) {
            const href = element.href
            if (!href.startsWith(hostname)) continue
            const res = await fetch(href)
            const css = await res.text()
            styles.push(css)
        }
        return styles
    }, BLOG_HOST)

    for (let i = 0; i < styles.length; i += 1) {
        styles[i] = await minifyCss(styles[i])
    }

    await page.$$eval('link[rel=stylesheet', async(elements, hostname, styles) => {
        const selfStyles = elements.filter(el => el.href.startsWith(hostname))

        for (let i = 0; i < selfStyles.length; i += 1) {
            const styleEl = document.createElement('style')
            styleEl.textContent = styles[i]
            selfStyles[i].parentNode.replaceChild(styleEl, selfStyles[i])
        }
    }, BLOG_HOST, styles)

    await page.$$eval('script:not([not-remove])', elements => {
        for (const element of elements) {
            element.parentNode.removeChild(element)
        }
    })

    const notfound = await page.$('#c-notfound')
    if (notfound) {
        crawledPathSet.delete(path)
        console.log(`  not found`)
        return
    } else {
        await savePage(path, await page.content())
    }

    const crawlLinks = await page.$$eval('a', (elements, host) => {
        return elements.filter(el => el.href.startsWith(host)).map(el => el.href)
    }, BLOG_HOST)
    console.log(`  Next ${crawlLinks.join(', ')}`)

    for (const crawlLink of crawlLinks) {
        await crawl(crawlLink.slice(BLOG_HOST.length + 1), page, crawledPathSet)
    }
}

async function savePage(path, content) {
    const dirName = path.split('/').slice(0, -1).join('/')
    const fileName = path.split('/').slice(-1)[0] || 'index.html'

    const dirStat = await fs.stat(__dirname + buildDir + '/' + dirName).catch(err => {
        // do nothing
    })
    if (!dirStat) {
        await fs.mkdir(__dirname + buildDir + '/'+ dirName, { recursive: true })
    }

    await fs.writeFile(__dirname + buildDir + '/' + dirName + '/' + fileName, content)
    console.log(`  Page saved: /${path}`)
}

module.exports = {
    minifyCss,
    buildMarkdown,
    copyAssets,
    createSiteMap,
    createFeed,
    buildArticles
}
