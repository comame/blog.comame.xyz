import { FunctionComponent } from 'react'
import { GetStaticProps } from 'next'
import MyHead from '../../components/head'
import Header from '../../components/header'
import Footer from '../../components/footer'
import EntryList from '../../components/entry-list'
import { Entry, listEntryMetadata } from '../../lib/entry'
import { config } from '../../lib/config'
import { useDev } from '../../hooks/useDev'

const UnlistedPosts: FunctionComponent<{
    entries: Entry[]
}> = ({ entries }) => {
    const [ isDev ] = useDev(true)
    if (!isDev) return null

    return <>
        <MyHead description={ config.hostname }></MyHead>
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
            entries: listEntryMetadata(true).filter(it => it.unlisted == true)
        }
    }
}

export default UnlistedPosts
