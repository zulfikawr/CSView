import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Info } from "lucide-react";

interface InfoPopoverProps<TData> {
  data: TData[];
  columns: string[];
  fileSize: number;
  // delimiter: string;
  // hasHeaderRow: boolean;
}

export function InfoPopover<TData extends Record<string, any>>({
  data,
  columns,
  fileSize,
  // delimiter,
  // hasHeaderRow,
}: InfoPopoverProps<TData>) {
  const totalRows = data.length;
  const columnNames = columns.join(", ");
  const totalCells = totalRows * columns.length;
  const emptyCells = data.reduce((count, row) =>
    count + Object.values(row).filter(value => value === "" || value === null || value === undefined).length
    , 0);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 px-2 lg:px-3">
          <Info className="mr-2 h-4 w-4" />
          Info
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">CSV Information</h4>
          </div>
          <div className="grid gap-2">
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
              <Label>File Size</Label>
              <div className="text-right">
                <Input value={`${(fileSize / 1024).toFixed(2)} KB`} readOnly className="h-8 bg-transparent text-right w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Column Names</Label>
              <div className="text-right">
                <Input value={columnNames} readOnly className="h-8 bg-transparent text-right w-full" />
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
