import Link from "next/link";
import React from "react";
import Header from "../../components/header";
import { useDev } from "../../hooks/useDev";

export default function Dev() {
  const [isDev] = useDev(true);
  if (!isDev) return null;

  return (
    <div>
      <Header />
      <div className="dev-pages">
        <h1>Dev Pages</h1>
        <ul>
          <li>
            <Link href="/dev/unlisted-posts">Unlisted posts</Link>
          </li>
        </ul>
      </div>
      <style jsx>{`
        div.dev-pages {
          margin: 1rem calc((100vw - var(--content-width)) / 2);
        }
      `}</style>
    </div>
  );
}
