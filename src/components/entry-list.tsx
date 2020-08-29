import { FunctionComponent, Fragment } from 'react'
import EntryListItem from './entry-list-item'
import { Entry } from '../lib/entry'

const EntryList: FunctionComponent<{
    entries: Entry[]
}> = ({ entries }) => {
    const years: string[] = []
    for (const entry of entries) {
        const year = entry.date.split('-')[0]
        if (!years.includes(year)) {
            years.push(year)
        }
    }
    years.sort((a: any, b: any) => (b - a))


    return <div className='index'>{
        years.map(it => <Fragment key={it}>
            <h2>{ it }</h2>
            <ul className='entries'>{
                entries.map(entry => <EntryListItem key={ entry.entry } entry={ entry } />)
            }</ul>
        </Fragment>)
    }</div>
}

export default EntryList
