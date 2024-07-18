"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useDropzone } from 'react-dropzone';
import { AlertModal } from "@/components/ui/alert-modal";
import { ErrorModal } from "@/components/ui/error-modal";
import { ReplaceModal } from "@/components/ui/replace-modal";
import { DataTableColumnHeader } from './data-table-column-header';
import { processFile, handleDeleteConfirm, handleReplaceConfirm } from "@/utils/data-table-utils";

interface DataTableProps<TData extends Record<string, any>> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  onDataLoaded: (data: TData[], columns: string[]) => void;
}

export function DataTable<TData extends Record<string, any>>({
  columns,
  data,
  onDataLoaded,
}: DataTableProps<TData>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [loading, setLoading] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = React.useState(false);
  const [isReplaceModalOpen, setIsReplaceModalOpen] = React.useState(false);
  const [pendingFile, setPendingFile] = React.useState<File | null>(null);
  const [fileSize, setFileSize] = React.useState<number>(0);
  

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      const file = acceptedFiles[0];
      if (data.length > 0) {
        setPendingFile(file);
        setIsReplaceModalOpen(true);
      } else {
        setFileSize(file.size);
        processFile(file, onDataLoaded, setLoading);
      }
    }
  }, [data, onDataLoaded]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    noClick: true,
    onDropRejected: () => setIsErrorModalOpen(true),
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // Extract column names from the columns prop
  const columnNames = React.useMemo(() => columns.map(col => String(col.header)), [columns]);

  return (
    <div className="space-y-4">
      <DataTableToolbar 
        table={table} 
        onUpload={open} 
        onDelete={() => setIsDeleteModalOpen(true)} 
        hasData={data.length > 0} 
        onDataLoaded={onDataLoaded}
        data={data}
        columns={columnNames}
        fileSize={fileSize}
      />
      <div
        {...getRootProps()}
        className={`rounded-md border ${isDragActive ? 'bg-secondary' : ''}`}
      >
        <input {...getInputProps()} />
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <DataTableColumnHeader
                        column={header.column}
                        columnName={String(header.column.columnDef.header)}
                      />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 4 }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((_column, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-4 w-full my-2" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow
                className={`${isDragActive ? 'bg-secondary' : ''} cursor-pointer`}
                onClick={open}
              >
                <TableCell colSpan={columns.length} className="h-96 text-center">
                  {isDragActive ? (
                    <p>Drop the CSV file here ...</p>
                  ) : (
                    <p>Drag and drop a CSV file here, or click to select a file</p>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
      <AlertModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => handleDeleteConfirm(onDataLoaded, setIsDeleteModalOpen)}
      />
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
      />
      <ReplaceModal
        isOpen={isReplaceModalOpen}
        onClose={() => {
          setIsReplaceModalOpen(false);
          setPendingFile(null);
        }}
        onConfirm={() => handleReplaceConfirm(pendingFile, onDataLoaded, setLoading, setIsReplaceModalOpen, setPendingFile)}
      />
    </div>
  );
}