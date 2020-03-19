const fs = require('fs').promises
const { destinationDir } = require('./dir')

async function createSiteMap(paths) {
    await fs.writeFile(destinationDir + '/sitemap.txt', '')
    for (const path of paths) {
        await fs.appendFile(destinationDir + '/sitemap.txt', 'https://blog.comame.xyz/' + path + '\n')
    }
    console.log('Sitemap created')
}

module.exports = createSiteMap
