import Link from 'next/link'
import styles from '../styles/header.module.scss'

const Header = () => {
    return <>
        <header className={ styles.header }>
            <Link href='/'><a>blog.comame.xyz</a></Link>
        </header>
    </>
}

export default Header
