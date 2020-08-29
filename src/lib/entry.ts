import entries from '../../archives/entries.json'

export interface Entry {
    entry: string,
    title: string,
    date: string,
    tags: string[],
    type: 'md'|'html'
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

export function listEntryMetadataByYear(year: string): Entry[] {
    return listEntryMetadata().filter(entry => {
        return entry.date.split('-')[0] == year
    })
}
