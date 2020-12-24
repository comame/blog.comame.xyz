import { FunctionComponent } from 'react'
import Head from 'next/head'
import { Entry } from '../lib/entry'

const MyHead: FunctionComponent<{
    title: string,
    tagPage?: boolean,
    postPage?: boolean,
    tag?: string
    entry?: Entry,
    description: string
}> = ({ title, tagPage, postPage, entry, tag, description, children }) => {
    const url =
        tagPage ? 'https://blog.comame.xyz/tags/' + tag + '/':
        postPage ? 'https://blog.comame.xyz/entries/' + entry?.date + '/' + entry?.entry + '/':
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
        { children }
    </Head>
}

export default MyHead
