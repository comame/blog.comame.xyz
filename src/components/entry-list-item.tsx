import { FunctionComponent } from 'react'
import Link from 'next/link'
import { Entry } from '../lib/entry'
import TagList from './tag-list'
import { toString, toStringMonthAndDate } from '../lib/date'

const EntryListItem: FunctionComponent<{ entry: Entry }> = ({ entry }) => {
    const time = toString(entry.date)

    return <li key={ entry.entry }>
        <time>{ toStringMonthAndDate(entry.date) }</time>
        <Link href='/entries/[date]/[id]' as={ `/entries/${time}/${entry.entry}`}><a>{ entry.title }</a></Link>
        <TagList tags={ entry.tags } />
    </li>
}

export default EntryListItem
