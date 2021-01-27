import { FunctionComponent, useState } from 'react'
import { GetStaticPaths, InferGetStaticPropsType, GetStaticPropsContext } from 'next'
import MyHead from '../../../components/head'
import { listEntryMetadata, getEntry } from '../../../lib/entry'
import Header from '../../../components/header'
import Footer from '../../../components/footer'
import Metadata from '../../../components/post/metadata'
import Content from '../../../components/post/content'
import Share from '../../../components/post/share'
import { toString } from '../../../lib/date'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const EntryPage: FunctionComponent<Props> = ({ entry, text }) => {
    const [ description, setDescription ] = useState<string>('')
    const year = entry.date.year

    return <>
        <MyHead
            postPage
            title={ entry.title + ' | blog.comame.xyz' }
            entry={ entry }
            description={ description }
        ></MyHead>
        <Header></Header>
        <div className='post'>
            <Metadata entry={ entry }></Metadata>
            <Content text={ text } setDescription={ setDescription }></Content>
            <Share entry={ entry }></Share>
        </div>
        <Footer entryPage entry={ entry } copyRightYear={ year }></Footer>
    </>
}

export default EntryPage

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: listEntryMetadata().map(entry => ({
            params: {
                date: toString(entry.date),
                id: entry.entry
            }
        })),
        fallback: false
    }
}

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
    const date = params?.date as string
    const id = params?.id as string

    const { entry, rendered } = await getEntry(Number.parseInt(date.split('-')[0] ?? '0'), id)

    return {
        props: {
            entry,
            text: rendered
        }
    }
}
