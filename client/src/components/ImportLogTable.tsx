import React from "react";

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

const ImportLogTable = ({ logs }: { logs: ImportLog[] }) => {
  return (
    <div className="overflow-x-auto w-full mt-6">
      <table className="min-w-full border-collapse rounded-lg shadow-lg overflow-hidden bg-white">
        <thead>
          <tr className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            <th className="p-3 border-b font-semibold text-left">Filename</th>

            <th className="p-3 border-b font-semibold text-left">Time</th>
            <th className="p-3 border-b font-semibold text-left">Fetched</th>
            <th className="p-3 border-b font-semibold text-left">Imported</th>
            <th className="p-3 border-b font-semibold text-left">New</th>
            <th className="p-3 border-b font-semibold text-left">Updated</th>
            <th className="p-3 border-b font-semibold text-left">Failed</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => {
            return (
              <tr
                key={i}
                className={
                  i % 2 === 0
                    ? "bg-gray-50 hover:bg-blue-50 transition-colors"
                    : "bg-white hover:bg-blue-50 transition-colors"
                }
              >
                <td className="p-3 border-b">{log.feedUrl}</td>

                <td className="p-3 border-b whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="p-3 border-b">{log.totalFetched}</td>
                <td className="p-3 border-b">{log.totalImported}</td>
                <td className="p-3 border-b">{log.newJobs}</td>
                <td className="p-3 border-b">{log.updatedJobs}</td>
                <td className="p-3 border-b">
                  <span
                    className={
                      (log.failedJobs?.length ?? 0) > 0
                        ? "bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold"
                        : "bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold"
                    }
                  >
                    {log.failedJobs?.length ?? 0}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ImportLogTable;
