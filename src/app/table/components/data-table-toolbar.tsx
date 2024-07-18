import React, { useEffect, useState } from "react";
import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { Button } from "@/components/ui/button";
import { Upload, Trash } from "lucide-react";
import { handleDeleteConfirm, CSVInfo } from "@/utils/data-table-utils";
import { AlertModal } from "@/components/ui/alert-modal";
import { InfoPopover } from "./info-popover";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onUpload: () => void;
  onDelete: () => void;
  hasData: boolean;
  onDataLoaded: (csvInfo: CSVInfo) => void;
  csvInfo: CSVInfo;
}

export function DataTableToolbar<TData extends Record<string, any>>({
  table,
  onUpload,
  hasData,
  onDataLoaded,
  csvInfo,
}: DataTableToolbarProps<TData>) {
  const [searchValue, setSearchValue] = useState<string>("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchValue(value);
    table.setGlobalFilter(value);
  };

  useEffect(() => {
    if (!hasData) {
      setSearchValue("");
      table.setGlobalFilter("");
    }
  }, [hasData, table]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search..."
          value={searchValue}
          onChange={handleSearchChange}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {hasData && (
          <>
            <InfoPopover csvInfo={csvInfo} />
            <DataTableViewOptions table={table} />
          </>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {hasData && (
          <>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteModalOpen(true)}
              className="h-8 px-2 lg:px-3 dark:bg-destructive/80 dark:hover:bg-destructive/90"
            >
              <Trash className="mx-2 md:mx-0 md:mr-2 h-4 w-4" />
              <p className="hidden md:flex">Delete</p>
            </Button>
          </>
        )}
        <Button
          variant="default"
          onClick={onUpload}
          className="h-8 px-2 lg:px-3 dark:bg-primary/80 dark:hover:bg-primary/90"
        >
          <Upload className="mx-2 md:mx-0 md:mr-2 h-4 w-4" />
          <p className="hidden md:flex">Upload</p>
        </Button>
        <AlertModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => handleDeleteConfirm(onDataLoaded, setIsDeleteModalOpen)}
        />
      </div>
    </div>
  );
}