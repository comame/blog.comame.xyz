import { FunctionComponent } from 'react'
import { GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import { Entry, listEntryMetadata, getEntry } from '../../../lib/entry'
import Header from '../../../components/header'
import Footer from '../../../components/footer'
import TagList from '../../../components/tag-list'

const EntryPage: FunctionComponent<{
    entry: Entry,
    text: string
}> = ({ entry, text }) => {
    const href = 'https://blog.comame.xyz/entries/' + entry.date + '/' + entry.entry + '.' + entry.type
    const twitterUrl = 'https://twitter.com/intent/tweet?text='+ encodeURIComponent(entry.title) + '%0a&url=' + encodeURIComponent(href) + '&related=comameito'
    const facebookUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(href)

    return <>
        <Head>
            <title>{entry.title} | blog.comame.xyz</title>
            <link rel='stylesheet' href='/css/style.css'></link>
            <link rel='stylesheet' href='/css/entry.css'></link>
        </Head>
        <Header></Header>
        <div>
            <div id='metadata'>
                <h1 id='title'>{ entry.title }</h1>
                <time id='time'>{ entry.date }</time>
                <TagList tags={ entry.tags }></TagList>
            </div>
            <div id='content' dangerouslySetInnerHTML={{ __html: text }}></div>
            <div id='share'>
                <img alt='共有' src='/icons/share.svg' />
                <a rel='noopener' target='_blank' title='Twitter で共有' href={ twitterUrl }>
                    <img alt='Twitter で共有' src='/icons/twitter_logo.svg' />
                </a>
                <a rel='noopener' target='_blank' title='Facebook で共有' href={ facebookUrl }>
                    <img alt='Facebook で共有' src='/icons/facebook_logo.svg' />
                </a>
                <a title='URL をコピー'>
                    <img alt='URL をコピー' src='/icons/link.svg' />
                </a>
            </div>
            <script src='/js/url-copy.js'></script>
        </div>
        <Footer entryPage entry={ entry }></Footer>
    </>
}

export default EntryPage

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: listEntryMetadata().map(entry => ({
            params: {
                date: entry.date,
                id: entry.entry
            }
        })),
        fallback: false
    }
}

export const getStaticProps: GetStaticProps<{
    entry: Entry,
    text: string
}> = async ({ params }) => {
    const date = params?.date as string
    const id = params?.id as string

    const { entry, rendered } = await getEntry(date.split('-')[0], id)

    return {
        props: {
        entry,
        text: rendered
        }
    }
}
