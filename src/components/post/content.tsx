import { FunctionComponent, useEffect } from 'react'
import styles from '../../styles/post/content.module.scss'

type MathJax = {
    typeset: () => unknown
}

declare global {
    interface Window {
        MathJax: MathJax
    }
}

const Content: FunctionComponent<{ text: string }> = ({ text }) => {
    useEffect(() => {
        window.MathJax.typeset()
    }, [])
    return <div className={ styles.content } dangerouslySetInnerHTML={{ __html: text }}></div>
}

export default Content
