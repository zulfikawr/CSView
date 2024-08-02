import Papa, { ParseResult } from "papaparse";
import { saveAs } from "file-saver";
import { toast } from "@/components/ui/use-toast";

export interface CSVInfo {
  data: Record<string, any>[];
  columns: string[];
  columnTypes: Record<string, string>;
  totalRows: number;
  emptyCells: number;
  fileSize: number;
  fileName: string;
  delimiter: string;
}

const detectDataType = (values: any[]): string => {
  const nonNullValues = values.filter(
    (v) => v !== null && v !== undefined && v !== ""
  );
  if (nonNullValues.length === 0) return "Empty";

  if (nonNullValues.every((v) => typeof v === "number")) return "Number";
  if (nonNullValues.every((v) => typeof v === "boolean")) return "Boolean";
  if (nonNullValues.every((v) => !isNaN(Date.parse(v)))) return "Date";
  return "String";
};

export const processFile = (
  file: File,
  onDataLoaded: (csvInfo: CSVInfo) => void,
  setLoading: (loading: boolean) => void
) => {
  setLoading(true);

  Papa.parse(file, {
    complete: (result: ParseResult<Record<string, any>>) => {
      const columns = result.meta.fields?.map((field) => field.trim()) || [];
      const data = result.data;

      const filteredData = data.filter((row) =>
        Object.values(row).some(
          (cell) =>
            cell !== null && cell !== undefined && String(cell).trim() !== ""
        )
      );

      const totalRows = filteredData.length;
      const emptyCells = filteredData.reduce(
        (count, row) =>
          count +
          Object.values(row).filter(
            (cell) =>
              cell === null || cell === undefined || String(cell).trim() === ""
          ).length,
        0
      );

      const columnTypes: Record<string, string> = {};
      columns.forEach((column) => {
        const columnValues = filteredData.map((row) => row[column]);
        columnTypes[column] = detectDataType(columnValues);
      });

      const csvInfo: CSVInfo = {
        data: filteredData,
        columns,
        columnTypes,
        totalRows,
        emptyCells,
        fileSize: file.size,
        fileName: file.name,
        delimiter: result.meta.delimiter || ",",
      };

      onDataLoaded(csvInfo);
      toast({
        description: `${totalRows} rows loaded`,
      });
      setLoading(false);
    },
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (header: string) => header.trim(),
    transform: (value: string) => value.trim(),
    dynamicTyping: true,
  });
};

export const handleDownload = (data: Record<string, any>[]) => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "exported_data.csv");
};

export const handleDeleteConfirm = (
  onDataLoaded: (csvInfo: CSVInfo) => void,
  setIsDeleteModalOpen: (open: boolean) => void
) => {
  onDataLoaded({
    data: [],
    columns: [],
    columnTypes: {},
    totalRows: 0,
    emptyCells: 0,
    fileSize: 0,
    fileName: "",
    delimiter: "",
  });
  toast({
    description: "Data deleted",
  });
  setIsDeleteModalOpen(false);
};

export const handleReplaceConfirm = (
  pendingFile: File | null,
  onDataLoaded: (csvInfo: CSVInfo) => void,
  setLoading: (loading: boolean) => void,
  setIsReplaceModalOpen: (open: boolean) => void,
  setPendingFile: (file: File | null) => void
) => {
  if (pendingFile) {
    processFile(pendingFile, onDataLoaded, setLoading);
  }
  setIsReplaceModalOpen(false);
  setPendingFile(null);
};
