import { FunctionComponent, Fragment } from 'react'
import EntryListItem from './entry-list-item'
import { Entry } from '../lib/entry'

import styles from '../styles/entry-list.module.scss'

const EntryList: FunctionComponent<{
    entries: Entry[]
}> = ({ entries }) => {
    const years: number[] = []
    for (const entry of entries) {
        const year = entry.date.year
        if (!years.includes(year)) {
            years.push(year)
        }
    }
    years.sort((a: any, b: any) => (b - a))


    return <div className={ styles['entry-list'] }>{
        years.map(year => <Fragment key={year}>
            <h2>{ year }</h2>
            <ul>{
                entries
                    .filter(entry => entry.date.year == year)
                    .map(entry => <EntryListItem key={ entry.entry } entry={ entry } />)
            }</ul>
        </Fragment>)
    }</div>
}

export default EntryList
