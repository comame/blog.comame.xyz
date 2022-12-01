import Link from 'next/link'
import { config } from '../lib/config'
import styles from '../styles/header.module.scss'

const Header = () => {
    return <>
        <header className={ styles.header }>
            <Link href='/'>{ config.hostname }</Link>
        </header>
    </>
}

export default Header
