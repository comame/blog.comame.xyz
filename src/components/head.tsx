import { FunctionComponent } from 'react'
import Head from 'next/head'
import { Entry } from '../lib/entry'

type tagPageProps = {
    tagPage: true,
    tag: string
}

type entryPageProps = {
    postPage: true,
    entry: Entry
}

type props = (tagPageProps | entryPageProps | {}) & {
    title: string,
    description: string
}

const MyHead: FunctionComponent<props> = (props) => {
    const { title, description } = props

    const url =
        'tagPage' in props ? 'https://blog.comame.xyz/tags/' + props.tag:
        'postPage' in props ? 'https://blog.comame.xyz/entries/' + props.entry.date + '/' + props.entry?.entry:
        'https://blog.comame.xyz'

    return <Head>
        <title>{ title }</title>
        <meta property='og:type' content='article'></meta>
        <meta property='og:url' content={ url }></meta>
        <meta property='og:title' content={ title }></meta>
        <meta property='og:site_name' content='blog.comame.xyz'></meta>
        <meta property='og:description' content={ description }></meta>
        <meta name='description' content={ description }></meta>
        <link rel='canonical' href={ url }/>
    </Head>
}

export default MyHead
