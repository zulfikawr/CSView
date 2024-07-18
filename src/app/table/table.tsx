"use client";

import React, { useState } from 'react';
import { DataTable } from "./components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { CSVInfo } from '@/utils/data-table-utils';

const Table = () => {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [columns, setColumns] = useState<ColumnDef<Record<string, any>, any>[]>([]);

  const handleDataLoaded = (csvInfo: CSVInfo) => {
    setData(csvInfo.data);
    setColumns(csvInfo.columns.map(col => ({
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