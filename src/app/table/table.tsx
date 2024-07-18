"use client";

import React, { useState } from 'react';
import { DataTable } from "./components/data-table";
import { ColumnDef } from "@tanstack/react-table";

const Table = () => {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [columns, setColumns] = useState<ColumnDef<Record<string, any>, any>[]>([]);

  const handleDataLoaded = (newData: Record<string, any>[], newColumns: string[]) => {
    setData(newData);
    setColumns(newColumns.map(col => ({
      accessorKey: col,
      header: col,
    })));
  };

  return (
    <div className="space-y-8 pb-6">
      <DataTable data={data} columns={columns} onDataLoaded={handleDataLoaded} />
    </div>
  );
};

export default Table;