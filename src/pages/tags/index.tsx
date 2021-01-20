import { InferGetStaticPropsType } from 'next'
import Link from 'next/link'
import React, { FC } from 'react'
import Footer from '../../components/footer'
import MyHead from '../../components/head'
import Header from '../../components/header'
import { listAllTags, listEntryMetadata } from '../../lib/entry'
import styles from '../../styles/tag-list-page.module.scss'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Index: FC<Props> = ({ tags, allEntries }) => {
    return <>
        <MyHead
            title='タグの一覧'
            description='タグの一覧'
        ></MyHead>
        <Header></Header>
        <div className={ styles['tag-page'] }>
            <h2>タグの一覧</h2>
            <ul>{
                tags.sort().map(tag => <li key={tag}>
                    <Link href={`/tags/${tag}`}>{ `${tag} (${allEntries.filter(it => it.tags.includes(tag)).length})`}</Link>
                </li>)
            }</ul>
        </div>
        <Footer></Footer>
    </>
}

export default Index

export const getStaticProps = async () => {
    return {
        props: {
            tags: listAllTags(),
            allEntries: listEntryMetadata()
        }
    }
}
