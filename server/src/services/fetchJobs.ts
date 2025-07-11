import axios from "axios";
import xml2js from "xml2js";
import { Agent } from "node:https";

const agent = new Agent({
  rejectUnauthorized: false,
});

export async function fetchJobsFromFeed(feedUrl: string): Promise<any[]> {
  const response = await axios.get(feedUrl, { httpsAgent: agent });

  const parsed = await xml2js.parseStringPromise(response.data, {
    explicitArray: false,
  });
  return parsed.rss?.channel?.item || [];
}
