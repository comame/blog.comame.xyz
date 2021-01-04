import { FunctionComponent } from 'react'
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import MyHead from '../../components/head'
import Header from '../../components/header'
import Footer from '../../components/footer'
import EntryList from '../../components/entry-list'
import { listAllTags, listEntryByTag } from '../../lib/entry'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Tag: FunctionComponent<Props> = ({ entries, tag }) => {
    return <>
        <MyHead
            tagPage
            title={ tag + ' | blog.comame.xyz'}
            tag={ tag }
            description={ tag }
        ></MyHead>
        <Header></Header>
        <h2 className='tagName'>タグ: { tag }</h2>
        <EntryList entries={ entries }></EntryList>
        <Footer></Footer>
        <style jsx>{`
            .tagName {
                width: var(--content-width);
                margin: 1rem auto;
            }
        `}</style>
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

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
    const tag = params?.tag as string
    return {
        props: {
            entries: listEntryByTag(tag),
            tag
        }
    }
}
