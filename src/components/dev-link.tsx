import Link from 'next/link'
import React from 'react'
import { useDev } from '../hooks/useDev'
import styles from '../styles/dev-link.module.scss'

export default function DevLink() {
    const [ isDev ] = useDev(false)
    if (!isDev) return null

    return <div className={ styles['dev-link'] }>
        <Link href='/dev'>Dev Links</Link>
    </div>
}
