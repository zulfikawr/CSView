"use client";

import * as React from "react";
import {
  ColumnDef,
  VisibilityState,
  ColumnFiltersState,
  SortingState,
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
import { processFile, handleDeleteConfirm, handleReplaceConfirm, CSVInfo } from "@/utils/data-table-utils";

interface DataTableProps<TData extends Record<string, any>> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  onDataLoaded: (csvInfo: CSVInfo) => void;
}

interface TableState {
  rowSelection: Record<string, boolean>;
  columnVisibility: VisibilityState;
  columnFilters: ColumnFiltersState;
  sorting: SortingState;
  loading: boolean;
  isDeleteModalOpen: boolean;
  isErrorModalOpen: boolean;
  isReplaceModalOpen: boolean;
  pendingFile: File | null;
  csvInfo: CSVInfo;
}

const initialCSVInfo: CSVInfo = {
  data: [],
  columns: [],
  columnTypes: {},
  totalRows: 0,
  emptyCells: 0,
  fileSize: 0,
  fileName: '',
  delimiter: "",
};

export function DataTable<TData extends Record<string, any>>({
  columns,
  data,
  onDataLoaded,
}: DataTableProps<TData>) {
  const [state, setState] = React.useState<TableState>({
    rowSelection: {},
    columnVisibility: {},
    columnFilters: [],
    sorting: [],
    loading: false,
    isDeleteModalOpen: false,
    isErrorModalOpen: false,
    isReplaceModalOpen: false,
    pendingFile: null,
    csvInfo: initialCSVInfo,
  });

  const updateState = (updates: Partial<TableState> | ((prevState: TableState) => Partial<TableState>)) => {
    setState(prevState => {
      const newUpdates = typeof updates === 'function' ? updates(prevState) : updates;
      return { ...prevState, ...newUpdates };
    });
  };

  const handleDataLoaded = (csvInfo: CSVInfo) => {
    updateState({ csvInfo });
    onDataLoaded(csvInfo);
  };

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      const file = acceptedFiles[0];
      if (data.length > 0) {
        updateState({ pendingFile: file, isReplaceModalOpen: true });
      } else {
        processFile(file, handleDataLoaded, (loading) => updateState({ loading }));
      }
    }
  }, [data, onDataLoaded]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    noClick: true,
    onDropRejected: () => updateState({ isErrorModalOpen: true }),
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: state.sorting,
      columnVisibility: state.columnVisibility,
      rowSelection: state.rowSelection,
      columnFilters: state.columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: (updater) => 
      updateState((prev) => ({ rowSelection: updater instanceof Function ? updater(prev.rowSelection) : updater })),
    onSortingChange: (updater) => 
      updateState((prev) => ({ sorting: updater instanceof Function ? updater(prev.sorting) : updater })),
    onColumnVisibilityChange: (updater) => 
      updateState((prev) => ({ columnVisibility: updater instanceof Function ? updater(prev.columnVisibility) : updater })),
    onColumnFiltersChange: (updater) => 
      updateState((prev) => ({ columnFilters: updater instanceof Function ? updater(prev.columnFilters) : updater })),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar 
        table={table} 
        onUpload={open} 
        onDelete={() => updateState({ isDeleteModalOpen: true })} 
        hasData={data.length > 0} 
        onDataLoaded={handleDataLoaded}
        csvInfo={state.csvInfo}
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
                        columnType={state.csvInfo.columnTypes[String(header.column.columnDef.header)] || 'Unknown'}
                      />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {state.loading ? (
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
                  ) : data.length === 0 ? (
                    <p>Drag and drop a CSV file here, or click to select a file</p>
                  ) : (
                    <p>No results found</p>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
      <AlertModal
        isOpen={state.isDeleteModalOpen}
        onClose={() => updateState({ isDeleteModalOpen: false })}
        onConfirm={() => handleDeleteConfirm(handleDataLoaded, () => updateState({ isDeleteModalOpen: false }))}
      />
      <ErrorModal
        isOpen={state.isErrorModalOpen}
        onClose={() => updateState({ isErrorModalOpen: false })}
      />
      <ReplaceModal
        isOpen={state.isReplaceModalOpen}
        onClose={() => updateState({ isReplaceModalOpen: false, pendingFile: null })}
        onConfirm={() => handleReplaceConfirm(
          state.pendingFile, 
          handleDataLoaded, 
          (loading) => updateState({ loading }), 
          () => updateState({ isReplaceModalOpen: false }),
          () => updateState({ pendingFile: null })
        )}
      />
    </div>
  );
}