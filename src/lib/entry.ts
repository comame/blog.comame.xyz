import entries from '../../entries/entries.json'
import marked from 'marked'
import { promises } from 'fs'
import path from 'path'

export interface Entry {
    entry: string,
    title: string,
    date: string,
    tags: string[],
    type: 'md'|'html'
}

function escapeHtmlText(text: string): string {
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function isEntry(arg: any): arg is Entry {
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
    if (!entries.every(it => isEntry(it))) {
        console.error('Invalid entries.json')
        throw Error('Invalid entries.json')
    }

    return entries.sort((a, b) => {
        const [aYear, aMonth, aDay] = a.date.split('-').map(it => Number.parseInt(it))
        const [bYear, bMonth, bDay] = b.date.split('-').map(it => Number.parseInt(it))

        if (aYear != bYear) return bYear - aYear
        if (aMonth != bMonth) return bMonth - aMonth
        return bDay - aDay
    }) as any
}

export function listEntryByYear(year: string): Entry[] {
    return listEntryMetadata().filter(entry => entry.date.split('-')[0] == year)
}

export function listAllTags(): string[] {
    const tagSet: Set<string> = new Set()
    for (const entry of entries) {
        for (const tag of entry.tags) tagSet.add(tag)
    }
    return Array.from(tagSet)
}

export function listEntryByTag(tag: string): Entry[] {
    return listEntryMetadata().filter(entry => entry.tags.includes(tag))
}

export async function getEntry(year: string, id: string): Promise<{
    entry: Entry,
    rendered: string
}> {
    const entry = listEntryByYear(year).find(it => it.entry == id)
    if (!entry) throw Error('entry not found')

    const filedir = path.join(process.cwd(), 'entries', year)
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
