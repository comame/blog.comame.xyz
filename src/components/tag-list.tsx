import { FunctionComponent } from 'react'
import Link from '../lib/link'
import styles from '../styles/tag-list.module.scss'

const TagList: FunctionComponent<{ tags: string[] }> = ({ tags }) => {
    return <ul className={ styles['tag-list'] }>{
        tags.map(tag => {
            return <li key={ tag }>
                <Link href='/tags/[tag]' as={ `/tags/${tag}` }><a>{ tag }</a></Link>
            </li>
        })
    }</ul>
}

export default TagList
