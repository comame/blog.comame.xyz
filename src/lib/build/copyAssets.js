const fs = require('fs').promises
const { assetsDir, destinationDir } = require('./dir')

async function copyAssets() {
    const copy = async (dirname, files, index = false) => {
        for (const file of files) {
            const stats = await fs.stat(assetsDir + '/' + dirname + '/' + file)
            if (stats.isDirectory()) {
                const isIndex = file == '_index'
                await copy(dirname + '/' + file, await fs.readdir(assetsDir + '/' + dirname + '/' + file), isIndex)
            } else {
                const targetDirname =
                    index ?
                    destinationDir :
                    destinationDir + '/assets/' + dirname

                const stat = await fs.stat(targetDirname).catch(() => {})
                if (!stat) await fs.mkdir(targetDirname, { recursive: true })
                await fs.copyFile(
                    assetsDir + '/' + dirname + '/' + file,
                    targetDirname + '/' + file
                )
                console.log(`Asset copied: ${dirname + '/' + file}`)
            }
        }
    }

    await copy('', await fs.readdir(assetsDir))
    console.log('Assets copied')
}

module.exports = copyAssets
