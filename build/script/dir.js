const path = require('path')

const rootDir =  path.resolve(__dirname + '../../../')
const destinationDir = path.resolve(rootDir, './docs')
const assetsDir = path.resolve(rootDir, './assets')
const archivesDir = path.resolve(rootDir, './archives')

module.exports = {
    rootDir,
    destinationDir,
    assetsDir,
    archivesDir
}
