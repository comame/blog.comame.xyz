import { FunctionComponent } from 'react'
import { GetStaticProps } from 'next'
import MyHead from '../components/head'
import Header from '../components/header'
import Footer from '../components/footer'
import EntryList from '../components/entry-list'
import { Entry, listEntryMetadata } from '../lib/entry'

const Index: FunctionComponent<{
    entries: Entry[]
}> = ({ entries }) => {
    return <>
        <MyHead title='blog.comame.xyz' description='blog.comame.xyz'></MyHead>
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
