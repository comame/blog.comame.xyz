import { NextApiHandler } from "next";
import { createSitemap } from "../../lib/createSitemap";
import { listEntryMetadata } from "../../lib/entry";

const handler: NextApiHandler = async (_req, res) => {
  const sitemap = createSitemap(listEntryMetadata());

  res.status(200);
  res.setHeader("Content-Type", "text/plain");
  res.end(sitemap);
};

export default handler;
