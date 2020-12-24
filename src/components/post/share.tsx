import { FunctionComponent } from 'react'
import { Entry } from '../../lib/entry'
import styles from '../../styles/post/share.module.scss'

const Share: FunctionComponent<{ entry: Entry }> = ({ entry }) => {
    const href = 'https://blog.comame.xyz/entries/' + entry.date + '/' + entry.entry
    const twitterUrl = 'https://twitter.com/intent/tweet?text='+ encodeURIComponent(entry.title) + '%0a&url=' + encodeURIComponent(href) + '&related=comameito'
    const facebookUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(href)

    return <div className={ styles.share }>
        <img alt='共有' src='/icons/share.svg' />
        <a rel='noopener' target='_blank' title='Twitter で共有' href={ twitterUrl }>
            <img alt='Twitter で共有' src='/icons/twitter_logo.svg' />
        </a>
        <a rel='noopener' target='_blank' title='Facebook で共有' href={ facebookUrl }>
            <img alt='Facebook で共有' src='/icons/facebook_logo.svg' />
        </a>
        <script async src='/js/url-copy.js'></script>
    </div>
}

export default Share
