const fs = require('fs').promises
const md = require('marked')
const { archivesDir } = require('./dir')

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

    const archiveDirs = await fs.readdir(archivesDir)
    for (const archiveDir of archiveDirs) {
        if (archiveDir == 'entries.json') continue
        const entryFilenames = await fs.readdir(archivesDir + '/' + archiveDir)
        for (const entryFilename of entryFilenames) {
            if (!entryFilename.endsWith('.md')) continue
            const markdown = await fs.readFile(archivesDir + '/' + archiveDir + '/' + entryFilename, {
                encoding: 'utf8'
            })
            const html = md(markdown, {
                headerIds: false,
                renderer
            })
            const htmlFilename = entryFilename.replace(/\.md$/, '.html')
            await fs.writeFile(archivesDir + '/' + archiveDir + '/' + htmlFilename, html)
            console.log(`Compiled ${archiveDir}/${entryFilename}`)
        }
    }
}

module.exports = buildMarkdown
