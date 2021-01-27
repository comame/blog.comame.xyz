import { FunctionComponent, useState } from 'react'
import { config } from '../../lib/config'
import { toString } from '../../lib/date'
import { Entry } from '../../lib/entry'
import styles from '../../styles/post/share.module.scss'

const Share: FunctionComponent<{ entry: Entry }> = ({ entry }) => {
    const href = `https://${ config.hostname }/entries/` + toString(entry.date) + '/' + entry.entry
    const twitterUrl = 'https://twitter.com/intent/tweet?text='+ encodeURIComponent(entry.title) + '%0a&url=' + encodeURIComponent(href) + `&related=${ config.twitterRelatedUser }`
    const facebookUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(href)

    const [ isCopiedShown, setIsCopiedShown ] = useState(false)
    const copy = () => {
        if (isCopiedShown) return
        setIsCopiedShown(true)

        const tmp = document.createElement('div')
        tmp.setAttribute('style', 'position: fixed; left: -100%;')
        tmp.appendChild(document.createElement("pre")).textContent = href
        document.body.appendChild(tmp)
        document.getSelection()?.selectAllChildren(tmp)
        document.execCommand('copy')
        document.body.removeChild(tmp)

        setTimeout(() => {
            setIsCopiedShown(false)
        }, 3000)
    }

    return <div className={ styles.share }>
        <img alt='共有' src='/icons/share.svg' />
        <a rel='noopener' target='_blank' title='Twitter で共有' href={ twitterUrl }>
            <img alt='Twitter で共有' src='/icons/twitter_logo.svg' />
        </a>
        <a rel='noopener' target='_blank' title='Facebook で共有' href={ facebookUrl }>
            <img alt='Facebook で共有' src='/icons/facebook_logo.svg' />
        </a>
        <a title='URL をコピー' onClick={ copy }>
            <img alt='URL をコピー' src='/icons/link.svg' />
        </a>
        <div id={ styles.copied } className={ isCopiedShown ? styles.shown : '' }>URL をコピーしました</div>
    </div>
}

export default Share
