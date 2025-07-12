import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridOptions, themeAlpine } from "ag-grid-community";

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
  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        headerName: "Filename",
        field: "feedUrl",
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
      },
      {
        headerName: "Time",
        field: "timestamp",
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        valueFormatter: (params) => {
          return new Date(params.value).toLocaleString();
        },
      },
      {
        headerName: "Fetched",
        field: "totalFetched",
        sortable: true,
        filter: false,
        resizable: true,
        width: 100,
        type: "numericColumn",
      },
      {
        headerName: "Imported",
        field: "totalImported",
        sortable: true,
        filter: false,
        resizable: true,
        width: 100,
        type: "numericColumn",
      },
      {
        headerName: "New",
        field: "newJobs",
        sortable: true,
        filter: false,
        resizable: true,
        width: 100,
        type: "numericColumn",
      },
      {
        headerName: "Updated",
        field: "updatedJobs",
        sortable: true,
        filter: false,
        resizable: true,
        width: 100,
        type: "numericColumn",
      },
      {
        headerName: "Failed",
        field: "failedJobs",
        sortable: true,
        filter: false,
        resizable: true,
        width: 100,
        type: "numericColumn",
        valueGetter: (params) => {
          return params.data.failedJobs?.length ?? 0;
        },
        cellRenderer: (params: any) => {
          const failedCount = params.data.failedJobs?.length ?? 0;
          const className =
            failedCount > 0
              ? "bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold"
              : "bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold";

          return <span className={className}>{failedCount}</span>;
        },
      },
    ],
    []
  );
  return (
    <div className="w-full h-[calc(100vh-7rem)]">
      <AgGridReact
        className="w-full h-full"
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
        }}
        theme={themeAlpine.withParams({
          oddRowBackgroundColor: "rgb(250, 245, 255)",
        })}
        rowData={logs}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 20, 50, 100]}
        domLayout="normal"
        animateRows={true}
        rowSelection="single"
        headerHeight={50}
        rowHeight={50}
      />
    </div>
  );
};

export default ImportLogTable;
