import { FunctionComponent } from 'react'
import Head from 'next/head'
import { Entry } from '../lib/entry'
import { config } from '../lib/config'

type tagPageProps = {
    tagPage: true,
    tag: string
}

type entryPageProps = {
    postPage: true,
    entry: Entry
}

type props = (tagPageProps | entryPageProps | {}) & {
    title?: string,
    description: string
}

const MyHead: FunctionComponent<props> = (props) => {
    const { title, description } = props

    const url =
        'tagPage' in props ? `https://${ config.hostname }/tags/` + props.tag:
        'postPage' in props ? `https://${ config.hostname }/entries/` + props.entry.date + '/' + props.entry?.entry:
        `https://${ config.hostname }`

    return <Head>
        <title>{
            title == undefined ? config.hostname : (title + ' | ' + config.hostname )
        }</title>
        <meta property='og:type' content='article'></meta>
        <meta property='og:url' content={ url }></meta>
        <meta property='og:title' content={ title }></meta>
        <meta property='og:site_name' content={ config.hostname }></meta>
        <meta property='og:description' content={ description }></meta>
        <meta name='description' content={ description }></meta>
        <link rel='canonical' href={ url }/>
    </Head>
}

export default MyHead
