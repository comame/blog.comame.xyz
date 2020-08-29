import { Entry } from '../lib/entry'
import Link from 'next/link'
import { FunctionComponent } from 'react'

const EntryListItem: FunctionComponent<{ entry: Entry }> = ({ entry }) => {
    const time = entry.date.split('-').slice(1).join('-')
    const year = entry.date.split('-')[0]

    return <li key={ entry.entry }>
        <time>{ time }</time>
        <Link href='/entries/[year]/[id]' as={ `/entries/${year}/${entry.entry}`}><a className='entry'>{ entry.title }</a></Link>
        <ul className='tag-list'>{
            entry.tags.map(tag => {
                return <li key={ tag }>
                    <Link href='/tags/[tag]' as={ `/tags/${tag}` }><a>{ tag }</a></Link>
                </li>
            })
        }</ul>
    </li>
}

export default EntryListItem
