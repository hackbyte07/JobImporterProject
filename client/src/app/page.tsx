"use client";
import { useEffect, useState } from "react";
import ImportLogTable from "../components/ImportLogTable";
import { groupBy, uniq } from "lodash-es";

interface FailedJob {
  reason: string;
  raw: any;
  _id: string;
}

interface ImportLog {
  timestamp: string;
  totalFetched: number;
  totalImported: number;
  newJobs: number;
  updatedJobs: number;
  failedJobs: FailedJob[];
  failures?: string[];
  feedUrl?: string;
  __v?: number;
  _id?: string;
}

export default function Home() {
  const [logs, setLogs] = useState<ImportLog[]>([]);

  useEffect(() => {
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/import/logs/stream`
    );

    eventSource.onmessage = (event) => {
      const newLog: ImportLog[] = JSON.parse(event.data);     
      

      setLogs((prev) => uniq([...newLog, ...prev])); // Add latest log on top
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <main className=" mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Real-time Import Logs</h1>
      <ImportLogTable logs={logs} />
    </main>
  );
}
