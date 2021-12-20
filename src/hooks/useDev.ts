import { useRouter } from 'next/router'
import { useEffect } from 'react'

export function useDev(redirect: boolean): [ isDev: boolean ] {
    const router = useRouter()
    const isDev = process.env.NODE_ENV === 'development'

    useEffect(() => {
        if (!isDev && redirect) router.replace('/')
    }, [ redirect, isDev ])

    return [ isDev ]
}
