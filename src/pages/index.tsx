import { FunctionComponent, Fragment } from 'react'
import { GetStaticProps } from 'next'
import Head from 'next/head'

import Header from '../components/header'
import Footer from '../components/footer'
import EntryList from '../components/entry-list'
import { Entry, listEntryMetadata, listEntryByYear } from '../lib/entry'

const Index: FunctionComponent<{
    entries: Entry[]
}> = ({ entries }) => {
    return <>
        <Head>
            <title>blog.comame.xyz</title>
            <link rel='stylesheet' href='/css/style.css'></link>
            <link rel='stylesheet' href='/css/home.css'></link>
        </Head>
        <Header></Header>
        <EntryList entries={ entries }></EntryList>
        <Footer></Footer>
    </>
}

export const getStaticProps: GetStaticProps<{
    entries: Entry[]
}> = async () => {
    return {
        props: {
            entries: listEntryMetadata()
        }
    }
}

export default Index