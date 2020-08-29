import { FunctionComponent } from 'react'
import { Entry } from '../lib/entry'

const Footer: FunctionComponent<{
    entryPage?: boolean,
    entry?: Entry
}> = ({ entryPage, entry }) => {
    const year = entry?.date.split('-')[0]
    const id = entry?.entry
    const type = entry?.type

    return <footer>
        <small>
            <a href='https://github.com/comame/blog.comame.xyz' target='_blank' rel='noopener'>
                <img id='build-status' src='https://github.com/comame/blog.comame.xyz/workflows/Build/badge.svg?event=push' />
            </a>
        </small>
        <small>
            <span>Copyright 2020 <a href='https://comame.xyz'>comame</a></span>
            {
                entryPage && <>
                    <span><a target='_blank' rel='noopener' href={ `https://github.com/comame/blog.comame.xyz/blob/master/archives/${ year }/${id}.${type}` }>source</a></span>
                    <span><a target='_blank' rel='noopener' href={ `https://github.com/comame/blog.comame.xyz/commits/master/archives/${ year }/${id}.${type}` }>history</a></span>
                </>
            }
            <span><a href="/feed.xml">Feed</a></span>
        </small>
    </footer>
}

export default Footer
