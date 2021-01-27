import { FunctionComponent } from 'react'
import { Entry } from '../lib/entry'
import styles from '../styles/footer.module.scss'
import Link from 'next/link'
import { config } from '../lib/config'

type props = {
    copyRightYear?: number
} & (
    {} |
    {
        entryPage: true,
        entry: Entry
    }
)

const Footer: FunctionComponent<props> = (props) => {
    const { copyRightYear } = props
    const { entry, entryPage } = 'entryPage' in props ? props : { entry: null, entryPage: null }

    const year = entry?.date.year
    const id = entry?.entry
    const type = entry?.type

    return <footer className={ styles.footer }>
        <small>
            <span><a className={ styles.copyright } target='_blank' rel='noopener' href={ config.copyrightUrl }>© { copyRightYear ?? new Date().getFullYear() + ' ' + config.copyrightName }</a></span>
            <span><a href="/api/feed.xml">Feed</a></span>
            <span><Link href='/tags'>Tags</Link></span>
            {
                !entryPage && <>
                    <span><a target='_blank' rel='noopener' href={ config.githubRepoUrl }>GitHub</a></span>
                </>
            }
            {
                entryPage && <>
                    <span><a target='_blank' rel='noopener' href={ `${ config.githubRepoUrl }/blob/main/entries/${ year }/${id}.${type}` }>GitHub</a></span>
                    <span><a target='_blank' rel='noopener' href={ `${ config.githubRepoUrl }/commits/main/entries/${ year }/${id}.${type}` }>History</a></span>
                </>
            }
        </small>
    </footer>
}

export default Footer
