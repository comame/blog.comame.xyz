const puppeteer = require('puppeteer')
const fs = require('fs').promises
const minifyCss = require('./minifyCss')

const { destinationDir } = require('./dir')

async function buildArticles(crawledPageSets, host) {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    })
    try {
        const page = await browser.newPage()
        await crawl('', page, crawledPageSets, host)
    } finally {
        await browser.close()
    }
}

async function crawl(path, page, crawledPathSet, host) {
    console.log(`Crawling /${path}`)

    if (crawledPathSet.has(path)) {
        console.log(`  skipped`)
        return
    }
    crawledPathSet.add(path)

    page.on('pageerror', error => {
        throw error
    })

    await page.goto(host + '/' + path)

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
    }, host)

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
    }, host, styles)

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
    }, host)
    console.log(`  Next ${crawlLinks.join(', ')}`)

    for (const crawlLink of crawlLinks) {
        await crawl(crawlLink.slice(host.length + 1), page, crawledPathSet, host)
    }
}

async function savePage(path, content) {
    const dirName = path.split('/').slice(0, -1).join('/')
    const fileName = path.split('/').slice(-1)[0] || 'index.html'

    const dirStat = await fs.stat(destinationDir + '/' + dirName).catch(err => {
        // do nothing
    })
    if (!dirStat) {
        await fs.mkdir(destinationDir + '/'+ dirName, { recursive: true })
    }

    await fs.writeFile(destinationDir + '/' + dirName + '/' + fileName, content)
    console.log(`  Page saved: /${path}`)
}

module.exports = buildArticles
