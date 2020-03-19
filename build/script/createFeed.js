const fs = require('fs').promises
const { archivesDir, destinationDir } = require('./dir')

async function createFeed(entries) {
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
        const htmlContent = await fs.readFile(archivesDir + '/' + year + '/' + entry.entry + '.html', {
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

    await fs.writeFile(destinationDir + '/feed.xml', rss)

    console.log('Feed created')
}

module.exports = createFeed
