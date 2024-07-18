import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Info } from "lucide-react";
import { CSVInfo } from "@/utils/data-table-utils";

interface InfoPopoverProps {
  csvInfo: CSVInfo;
}

export function InfoPopover({ csvInfo }: InfoPopoverProps) {
  const { columns, columnTypes, totalRows, emptyCells, fileSize, fileName, delimiter } = csvInfo;
  const columnNames = columns.join(", ");
  const columnInfo = columns.map(col => `${col} (${columnTypes[col]})`).join(", ");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 px-2 lg:px-3">
          <Info className="mx-2 md:mx-0 md:mr-2 h-4 w-4" />
          <p className="hidden md:flex">Info</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-96">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">CSV Information</h4>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-2 items-center gap-4">
              <Label>File Name</Label>
              <div className="text-right">
                <Input value={fileName} readOnly className="h-8 bg-transparent text-right w-full text-ellipsis" />
              </div>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <Label>File Size</Label>
              <div className="text-right">
                <Input value={`${(fileSize / 1024).toFixed(2)} KB`} readOnly className="h-8 bg-transparent text-right w-full" />
              </div>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <Label>Columns</Label>
              <div className="text-right">
                <Input value={columns.length.toString()} readOnly className="h-8 bg-transparent text-right w-full" />
              </div>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <Label>Rows</Label>
              <div className="text-right">
                <Input value={totalRows.toString()} readOnly className="h-8 bg-transparent text-right w-full" />
              </div>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <Label>Empty Cells</Label>
              <div className="text-right">
                <Input value={emptyCells.toString()} readOnly className="h-8 bg-transparent text-right w-full" />
              </div>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <Label>Delimiter</Label>
              <div className="text-right">
                <Input value={delimiter} readOnly className="h-8 bg-transparent text-right w-full" />
              </div>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <Label>Column Info</Label>
              <div className="text-right">
                <Input value={columnInfo} readOnly className="h-8 bg-transparent text-right w-full text-ellipsis" />
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
