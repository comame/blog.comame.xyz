import { FunctionComponent } from 'react'
import { Entry } from '../../lib/entry'
import TagList from '../tag-list'
import styles from '../../styles/post/metadata.module.scss'
import { toString } from '../../lib/date'

const Metadata: FunctionComponent<{ entry: Entry }> = ({ entry }) => {
    return <div className={ styles.metadata }>
        <h1 id='title'>{ entry.title }</h1>
        <time id='time'>{ toString(entry.date) }</time>
        <TagList tags={ entry.tags }></TagList>
    </div>
}

export default Metadata
