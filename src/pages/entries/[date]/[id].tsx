import { FunctionComponent } from 'react'
import { GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import { Entry, listEntryMetadata, getEntry } from '../../../lib/entry'
import Header from '../../../components/header'
import Footer from '../../../components/footer'
import '../../../styles/post.module.scss'
import Metadata from '../../../components/post/metadata'
import Content from '../../../components/post/content'
import Share from '../../../components/post/share'

const EntryPage: FunctionComponent<{
    entry: Entry,
    text: string
}> = ({ entry, text }) => {
    return <>
        <Head>
            <title>{entry.title} | blog.comame.xyz</title>
        </Head>
        <Header></Header>
        <div className='post'>
            <Metadata entry={ entry }></Metadata>
            <Content text={ text }></Content>
            <Share entry={ entry }></Share>
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