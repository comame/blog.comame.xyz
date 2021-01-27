import { FunctionComponent } from 'react'
import styles from '../../styles/post/content.module.scss'

const Content: FunctionComponent<{ text: string }> = ({ text }) => {
    return <div className={ styles.content } dangerouslySetInnerHTML={{ __html: text }}></div>
}

export default Content
