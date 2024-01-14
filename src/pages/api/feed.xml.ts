import { NextApiHandler } from "next";
import { createFeed } from "../../lib/createFeed";
import { getEntry, listEntryMetadata } from "../../lib/entry";

const handler: NextApiHandler = async (_req, res) => {
  const entries = listEntryMetadata();
  const entriesWithText = await Promise.all(
    entries.map(async (entry) => {
      const year = entry.date.year;
      return {
        html: (await getEntry(year, entry.entry)).rendered,
        ...entry,
      };
    }),
  );
  const feed = createFeed(entriesWithText);

  res.status(200);
  res.setHeader("Content-Type", "application/xml");
  res.end(feed);
};

export default handler;
