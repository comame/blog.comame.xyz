import { config } from "./config";
import { compareByDate, toString } from "./date";
import { Entry } from "./entry";
import { escapeHtmlText } from "./escapeHtmlText";

type EntryWithRenderedHTML = Entry & { html: string };

export function createFeed(entries: EntryWithRenderedHTML[]) {
  const items = [];

  const base = (updated: string, items: string[]) => `
    <?xml version='1.0'?>
    <feed xmlns='http://www.w3.org/2005/Atom'>
      <id>https://${config.hostname}/</id>
      <title>${config.hostname}</title>
      <link rel='alternate' href='https://${config.hostname}/' />
      <link rel='self' href='https://${config.hostname}/feed.xml' />
      <author><name>${config.copyrightName}</name></author>
      <updated>${updated}</updated>
      ${items.join("")}
    </feed>
    `;

  const item = (title: string, link: string, date: string, content: string) => `
    <entry>
      <title>${title}</title>
      <link rel='alternate' href='${link}' />
      <id>${link}</id>
      <updated>${date}T00:00:00Z</updated>
      <summary>${escapeHtmlText(content, true)}</summary>
    </entry>
    `;

  entries.sort((a, b) => compareByDate(a.date, b.date));

  for (const entry of entries) {
    const title = entry.title;
    const date = entry.date;
    const link =
      `https://${config.hostname}/entries/` +
      toString(date) +
      "/" +
      entry.entry;

    items.push(item(title, link, toString(date), entry.html));
  }

  const date =
    entries.length > 0
      ? new Date(
          entries[0]!!.date.year,
          entries[0]!!.date.month - 1,
          entries[0]!!.date.date,
        )
      : new Date();
  const updated =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1 < 10
      ? `0${date.getMonth() + 1}-`
      : `${date.getMonth() + 1}-`) +
    (date.getDate() < 10 ? `0${date.getDate()}T` : `${date.getDate()}T`) +
    (date.getHours() < 10 ? `0${date.getHours()}:` : `${date.getHours()}:`) +
    (date.getMinutes() < 10
      ? `0${date.getMinutes()}:`
      : `${date.getMinutes()}:`) +
    (date.getSeconds() < 10
      ? `0${date.getSeconds()}Z`
      : `${date.getSeconds()}Z`);

  const rss = base(updated, items).replace(/^\s+|\s+$/g, "");
  return rss;
}
