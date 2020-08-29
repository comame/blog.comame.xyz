import Head from 'next/head'
import Link from 'next/link'

import Header from '../components/header'

const NotFound = () => {
    return <>
        <Head>
            <title>404 | blog.comame.xyz</title>
            <link rel='stylesheet' href='/css/style.css'></link>
        </Head>
        <Header></Header>
        <div>
            <p>Not Found</p>
            <p><Link href='/'><a>トップへ</a></Link></p>
        </div>
        <style jsx>{`
            div {
                margin: 1rem calc((100vw - var(--content-width)) / 2);
            }
    `}</style>
    </>
}

export default NotFound
