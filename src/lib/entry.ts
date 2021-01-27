import rawEntries from '../../entries/entries.json'
import marked from 'marked'
import { promises } from 'fs'
import path from 'path'
import { escapeHtmlText } from './escapeHtmlText'
import { compareByDate } from './date'

export type Entry = {
    entry: string,
    title: string,
    date: { year: number, month: number, date: number },
    tags: string[],
    type: 'md'|'html'
}

type RawEntry = Omit<Entry, 'date'> & {
    date: string
}

function isRawEntry(arg: any): arg is RawEntry {
    return (
        typeof arg == 'object' &&
        typeof arg?.entry == 'string' &&
        typeof arg?.date == 'string' &&
        /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(arg.date) &&
        Array.isArray(arg?.tags) &&
        arg.tags.every((tag: any) => typeof tag == 'string') &&
        (arg?.type == 'md' || arg?.type == 'html')
    )
}

export function listEntryMetadata(): Entry[] {
    if (!rawEntries.every(it => isRawEntry(it))) {
        console.error('Invalid entries.json')
        throw Error('Invalid entries.json')
    }

    return (rawEntries as RawEntry[]).map(entry => {
        const [ year, month, date ] = entry.date.split('-').map(it => Number.parseInt(it, 10))
        if (typeof year == 'undefined' || typeof month == 'undefined' || typeof date == 'undefined') {
            console.error('Invalid date in entries.json', { entry })
            throw Error('Invalid date in entries.json')
        }
        return {
            ...entry,
            date: { year, month, date }
        }
    }).sort((a, b) => compareByDate(a.date, b.date))
}

export function listEntryByYear(year: number): Entry[] {
    return listEntryMetadata().filter(entry => entry.date.year == year)
}

export function listAllTags(): string[] {
    const tagSet: Set<string> = new Set()
    for (const entry of listEntryMetadata()) {
        for (const tag of entry.tags) tagSet.add(tag)
    }
    return Array.from(tagSet)
}

export function listEntryByTag(tag: string): Entry[] {
    return listEntryMetadata().filter(entry => entry.tags.includes(tag))
}

export async function getEntry(year: number, id: string): Promise<{
    entry: Entry,
    rendered: string
}> {
    const entry = listEntryByYear(year).find(it => it.entry == id)
    if (!entry) throw Error('entry not found')

    const filedir = path.join(process.cwd(), 'entries', year.toString())
    const filepath = filedir + '/' + entry.entry + '.' + entry.type

    const file = await promises.readFile(filepath, 'utf-8')

    if (entry.type == 'html') {
        return {
            entry, rendered: file
        }
    } else {
        const renderer = new marked.Renderer()
        renderer.link = function(href, _title, text) {
            const escaped = escapeHtmlText(text)
            if (
                href?.startsWith('http://') ||
                href?.startsWith('https://') ||
                href?.startsWith('//')
            ) {
                return `<a href=${href} target='_blank' rel='noopener'>${escaped}</a>`
            } else {
                return `<a href=${href}>${escaped}</a>`
            }
        }
        renderer.code = (code, info) => {
            const escapedCode = escapeHtmlText(code)
            const lines = escapedCode.split(/\n/).map(it => {
                if (info == 'diff' && it.startsWith('+ ')) {
                    return `<code class='addition'>${it}</code>`
                } else if (info == 'diff' && it.startsWith('- ')) {
                    return `<code class='deletion'>${it}</code>`
                } else {
                    return `<code>${it}</code>`
                }
            })
            return [ '<pre>', ...lines, '</pre>' ].join('\n')
        }

        const html = marked(file, {
            headerIds: false,
            renderer
        })

        return {
            entry,
            rendered: html
        }
    }
}
