import type { AppProps } from 'next/app'
import DevLink from '../components/dev-link'
import '../styles/global.scss'

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <DevLink />
    <Component {...pageProps} />
  </>
}

export default MyApp
