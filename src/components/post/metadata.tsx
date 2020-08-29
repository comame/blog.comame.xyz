import { FunctionComponent } from 'react'
import { Entry } from '../../lib/entry'
import TagList from '../tag-list'
import styles from '../../styles/post/metadata.module.scss'

const Metadata: FunctionComponent<{ entry: Entry }> = ({ entry }) => {
    return <div className={ styles.metadata }>
        <h1 id='title'>{ entry.title }</h1>
        <time id='time'>{ entry.date }</time>
        <TagList tags={ entry.tags }></TagList>
    </div>
}

export default Metadata
