import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

import Header from "../components/header";
import { config } from "../lib/config";

const NotFound = () => {
  const router = useRouter();
  const path = router.asPath;

  if (
    (path.startsWith("/entries/") || path.startsWith("/tags/")) &&
    path.endsWith(".html")
  ) {
    useEffect(() => {
      router.replace(path.slice(0, -5));
    }, []);
  }

  return (
    <>
      <Head>
        <title>404 | {config.hostname}</title>
      </Head>
      <Header></Header>
      <div>
        <p>ページが見つかりませんでした</p>
        <p>
          <Link href="/">トップへ</Link>
        </p>
      </div>
      <style jsx>{`
        div {
          margin: 1rem calc((100vw - var(--content-width)) / 2);
        }
      `}</style>
    </>
  );
};

export default NotFound;
