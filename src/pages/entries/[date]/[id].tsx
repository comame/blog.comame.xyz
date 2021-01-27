import { FunctionComponent, useEffect, useState } from 'react'
import { GetStaticPaths, InferGetStaticPropsType, GetStaticPropsContext } from 'next'
import MyHead from '../../../components/head'
import { listEntryMetadata, getEntry } from '../../../lib/entry'
import Header from '../../../components/header'
import Footer from '../../../components/footer'
import Metadata from '../../../components/post/metadata'
import Content from '../../../components/post/content'
import Share from '../../../components/post/share'
import { toString } from '../../../lib/date'
import { config } from '../../../lib/config'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const EntryPage: FunctionComponent<Props> = ({ entry, text }) => {
    const [ description, setDescription ] = useState<string>('')
    const year = entry.date.year

    useEffect(() => {
        // SSR されないことに気付いたが、まあ今までも SSR されていなかったので、気にしないことにする
        const el = document.createElement('div')
        el.innerHTML = text
        const desc = el.textContent!!.replace(/\n/g, ' ').replace(/\s+/, ' ').slice(0, 137) + '...'
        setDescription(desc)
    }, [])

    return <>
        <MyHead
            postPage
            title={ entry.title + ` | ${ config.hostname }` }
            entry={ entry }
            description={ description }
        ></MyHead>
        <Header></Header>
        <div>
            <Metadata entry={ entry }></Metadata>
            <Content text={ text }></Content>
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
