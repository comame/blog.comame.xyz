const { readFile } = require('fs')
const fs = require('fs/promises')

async function readLine() {
    return new Promise(resolve => {
        let text = ''
        process.stdin.setEncoding('utf-8')
        process.stdin.resume()
        process.stdin.on('data', data => {
            text += data
            if (data.endsWith('\n')) {
                resolve(text.slice(0, -1))
                process.stdin.pause()
            }
        })
    })
}

const handleError = (err, method) => {
    console.log(`Error in ${method}`)
    console.log(err)
    process.exit(0)
}

const parseJson = async (...args) => {
    return JSON.parse(...args)
}

;(async () => {
    process.stdout.write('Title: ')
    const title = await readLine()

    process.stdout.write('Filename: ')
    const entry = await readLine()

    const date = new Date()
    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const day = ('0' + date.getDate()).slice(-2)

    const entryData = {
        entry,
        title,
        date: `${year}-${month}-${day}`,
        tags: [],
        type: 'md'
    }

    const filename = entry + '.md'
    const dirname = `entries/${year}`

    await fs.stat(dirname).catch(err => {
        if (err.code == 'ENOENT') {
            console.log(`mkdir ${dirname}.`)
            return fs.mkdir(dirname)
        } else {
            handleError(err, `fs.stat(${dirname})`)
        }
    }).catch(err => {
        handleError(err, `fs.mkdir(${dirname})`)
    })

    console.log(`Creating empty file ${dirname}/${filename}`)
    await fs.writeFile(dirname + '/' + filename, '', {
        flag: 'ax'
    }).catch(err => {
        handleError(err, `fs.writeFile(${dirname + '/' + filename}, '')`)
    })

    const entriesJson = await fs.readFile('entries/entries.json', {
        encoding: 'utf-8'
    }).catch(err => {
        handleError(err, `fs.readFile('entries/entries.json')`)
    }).then(text => {
        return parseJson(text)
    }).catch(err => {
        handleError(err, `JSON.parse`)
    })
    entriesJson.push(entryData)

    console.log('Updating entries.json')
    const newEntriesStr = JSON.stringify(entriesJson, undefined, 4)
    await fs.writeFile('entries/entries.json', newEntriesStr, {
        encoding: 'utf-8'
    }).catch(err => {
        handleError(err, `fs.writeFile(entries/entries.json, [newEntriesStr])`)
    })
})()
