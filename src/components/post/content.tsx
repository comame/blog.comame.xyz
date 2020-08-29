import { FunctionComponent, useRef, useEffect, Dispatch, SetStateAction } from 'react'
import styles from '../../styles/post/content.module.scss'

const Content: FunctionComponent<{ text: string, setDescription: Dispatch<SetStateAction<string>> }> = ({ text, setDescription }) => {
    const contentRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        setDescription(contentRef.current?.textContent?.replace(/\n/g, ' ').replace(/\s+/, ' ').slice(0, 137) + '...' ?? '')
    }, [ text ])

    return <div className={ styles.content } ref={ contentRef } dangerouslySetInnerHTML={{ __html: text }}></div>
}

export default Content
