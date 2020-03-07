const { BLOG_HOST, OVERWRITE } = process.env

const puppeteer = require('puppeteer')
const fs = require('fs').promises

async function savePage(path, content, overwrite) {
    const dirName = path.split('/').slice(0, -1).join('/')
    const fileName = path.split('/').slice(-1)[0] || 'index.html'

    const dirStat = await fs.stat(__dirname + '/build/' + dirName).catch(err => {
        // do nothing
    })
    if (!dirStat) {
        console.log(`Directory ${dirName} created`)
        await fs.mkdir(__dirname + '/build/'+ dirName, { recursive: true })
    }

    const fileStat = await fs.stat(__dirname + '/build/' + dirName + '/' + fileName).catch(err => {
        // do nothing
    })

    if (!fileStat || (fileStat && overwrite)) {
        await fs.writeFile(__dirname + '/build/' + dirName + '/' + fileName, content)
        if (fileStat) {
            console.log(`File ${dirName}/${fileName} overwritten`)
        } else {
            console.log(`File ${dirName}/${fileName} created`)
        }
    } else {
        console.log(`File ${dirName}/${fileName} skipped`)
    }
}

async function copyAssets() {
    const copy = async (dirname, files) => {
        console.log({ dirname, files })
        for (const file of files) {
            const stats = await fs.stat(__dirname + '/assets/' + dirname + '/' + file)
            if (stats.isDirectory()) {
                await copy(dirname + '/' + file, await fs.readdir(__dirname + '/assets/' + dirname + '/' + file))
            } else {
                const stat = await fs.stat(__dirname + '/bulid/assets/' + dirname).catch(() => {})
                if (!stat) await fs.mkdir(__dirname + '/build/assets/' + dirname, { recursive: true })
                await fs.copyFile(
                    __dirname + '/assets/' + dirname + '/' + file,
                    __dirname + '/build/assets/' + dirname + '/' + file
                )
            }
        }
    }

    await copy('', await fs.readdir(__dirname + '/assets'))
}

async function crawl(path, page, crawledPathSet) {
    if (crawledPathSet.has(path)) return
    crawledPathSet.add(path)

    console.log(path)

    await page.goto(BLOG_HOST + '/' + path)
    await page.$$eval('script:not([not-remove])', elements => {
        for (const element of elements) {
            element.parentNode.removeChild(element)
        }
    })

    const notfound = await page.$('#c-notfound')

    const content = await page.content()
    if (!notfound) savePage(path, content, OVERWRITE)

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

    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()

    await crawl('', page, new Set())

    await browser.close()
}

main()
