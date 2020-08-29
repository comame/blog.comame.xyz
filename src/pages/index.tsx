import { FunctionComponent, Fragment } from 'react'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Header from '../components/header'
import Footer from '../components/footer'
import { Entry, listEntryMetadata, listEntryMetadataByYear } from '../lib/entry'
import EntryListItem from '../components/entry-list-item'

const Index: FunctionComponent<{
    entries: Entry[]
}> = ({ entries }) => {
    const years: string[] = []
    for (const entry of entries) {
        const year = entry.date.split('-')[0]
        if (!years.includes(year)) {
            years.push(year)
        }
    }
    years.sort((a: any, b: any) => (b - a))

    return <>
        <Head>
            <title>blog.comame.xyz</title>
            <link rel='stylesheet' href='/css/style.css'></link>
            <link rel='stylesheet' href='/css/home.css'></link>
        </Head>
        <Header></Header>
        <div className='index'>{
            years.map(it => <Fragment key={it}>
                <h2>{ it }</h2>
                <ul className='entries'>{
                    listEntryMetadataByYear(it).map(entry => <EntryListItem key={ entry.entry } entry={ entry } />)
                }</ul>
            </Fragment>)
        }</div>
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
