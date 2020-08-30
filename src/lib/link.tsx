import NextLink from 'next/link'
import { FunctionComponent, cloneElement } from 'react'

const Link: FunctionComponent<{
    as?: string,
    href: string
}> = ({ href, as, children }) => {
    if (process.env.NEXT_PUBLIC_STATIC) {
        if (typeof children != 'object' || !children) {
            return <a href={ as ?? href }>{ children }</a>
        }
        let path = as ?? href
        if (path != '/' && !path.endsWith('.html')) path += '.html'
        return cloneElement(children as any, { href: path })
    } else {
        return <NextLink as={ as } href={ href }>{ children }</NextLink>
    }
}

export default Link
