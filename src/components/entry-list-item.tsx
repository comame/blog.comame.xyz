import { FunctionComponent } from 'react'
import Link from 'next/link'
import { Entry } from '../lib/entry'
import TagList from './tag-list'

const EntryListItem: FunctionComponent<{ entry: Entry }> = ({ entry }) => {
    const time = entry.date.split('-').slice(1).join('-')

    return <li key={ entry.entry }>
        <time>{ time }</time>
        <Link href='/entries/[year]/[id]' as={ `/entries/${entry.date}/${entry.entry}`}><a>{ entry.title }</a></Link>
        <TagList tags={ entry.tags } />
    </li>
}

export default EntryListItem
