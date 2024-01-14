import type { AppProps } from "next/app";
import DevLink from "../components/dev-link";
import "../styles/global.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <DevLink />
      <Component {...pageProps} />
      <script
        id="MathJax-script"
        async
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
      ></script>
    </>
  );
}

export default MyApp;
