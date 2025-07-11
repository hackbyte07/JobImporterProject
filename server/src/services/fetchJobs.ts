import axios from "axios";
import { Agent } from "node:https";
import { parseXML } from "../utils/parseXML";

const agent = new Agent({
  rejectUnauthorized: false,
});

export async function fetchJobsFromFeed(feedUrl: string): Promise<any[]> {
  const response = await axios.get(feedUrl, { httpsAgent: agent });

  return parseXML(response?.data);
}
