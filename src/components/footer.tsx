import { FunctionComponent } from 'react'
import { Entry } from '../lib/entry'
import styles from '../styles/footer.module.scss'
import Link from 'next/link'

const Footer: FunctionComponent<{
    entryPage?: boolean,
    entry?: Entry,
    copyRightYear?: number
}> = ({ entryPage, entry, copyRightYear }) => {
    const year = entry?.date.split('-')[0]
    const id = entry?.entry
    const type = entry?.type

    return <footer className={ styles.footer }>
        <small>
            <a href='https://github.com/comame/blog.comame.xyz' target='_blank' rel='noopener'>
                <img alt='GitHub Actions build status' id='build-status' src='https://github.com/comame/blog.comame.xyz/workflows/Build/badge.svg?event=push' />
            </a>
        </small>
        <small>
            <span>© { copyRightYear ?? new Date().getFullYear() } <a href='https://comame.xyz'>comame</a></span>
            {
                entryPage && <>
                    <span><a target='_blank' rel='noopener' href={ `https://github.com/comame/blog.comame.xyz/blob/main/entries/${ year }/${id}.${type}` }>source</a></span>
                    <span><a target='_blank' rel='noopener' href={ `https://github.com/comame/blog.comame.xyz/commits/main/entries/${ year }/${id}.${type}` }>history</a></span>
                </>
            }
            <span><a href="/api/feed.xml">Feed</a></span>
            <span><Link href='/tags'>Tags</Link></span>
        </small>
    </footer>
}

export default Footer
