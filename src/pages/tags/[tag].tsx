import { FunctionComponent } from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import MyHead from '../../components/head'
import Header from '../../components/header'
import Footer from '../../components/footer'
import EntryList from '../../components/entry-list'
import { Entry, listAllTags, listEntryByTag } from '../../lib/entry'

const Tag: FunctionComponent<{ entries: Entry[], tag: string }> = ({ entries, tag }) => {
    return <>
        <MyHead
            tagPage
            title={ tag + ' | blog.comame.xyz'}
            tag={ tag }
            description={ tag }
        ></MyHead>
        <Header></Header>
        <EntryList entries={ entries }></EntryList>
        <Footer></Footer>
    </>
}

export default Tag

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: listAllTags().map(tag => ({
            params: {
                tag
            }
        })),
        fallback: false
    }
}

export const getStaticProps: GetStaticProps<{
    entries: Entry[],
    tag: string
}> = async ({ params }) => {
    const tag = params?.tag as string
    return {
        props: {
            entries: listEntryByTag(tag),
            tag
        }
    }
}
