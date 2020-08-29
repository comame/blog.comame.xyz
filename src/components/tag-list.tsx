import { FunctionComponent } from 'react'
import Link from 'next/link'

const TagList: FunctionComponent<{ tags: string[] }> = ({ tags }) => {
    return <ul className='tag-list'>{
        tags.map(tag => {
            return <li key={ tag }>
                <Link href='/tags/[tag]' as={ `/tags/${tag}` }><a>{ tag }</a></Link>
            </li>
        })
    }</ul>
}

export default TagList
