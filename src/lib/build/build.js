const fs = require('fs')
const path = require('path')

void (() => {
    const feed = require('./createFeed')()
    const sitemap = require('./createSitemap')()

    const dir = path.resolve(__dirname + '../../../../docs')
    fs.writeFileSync(dir + '/' + 'feed.xml', feed, 'utf8')
    fs.writeFileSync(dir + '/' + 'sitemap.txt', sitemap, 'utf8')

    console.log('RSS and sitemap generated.')
})()
