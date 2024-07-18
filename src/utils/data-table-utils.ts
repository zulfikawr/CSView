import Papa from 'papaparse';
import { toast } from '@/components/ui/use-toast';

export const processFile = <TData>(
  file: File,
  onDataLoaded: (data: TData[], columns: string[]) => void,
  setLoading: (loading: boolean) => void
) => {
  setLoading(true);
  Papa.parse(file, {
    complete: (result) => {
      const columns = result.data[0] as string[];
      const data = result.data.slice(1)
        .filter((row: any) => row.some((cell: any) => cell && cell.trim() !== ""))
        .map((row: any) => {
          const obj: Record<string, any> = {};
          columns.forEach((col, index) => {
            obj[col] = row[index];
          });
          return obj;
        });

      onDataLoaded(data as TData[], columns);
      toast({
        description: `${data.length} rows loaded`,
      });
      setLoading(false);
    },
    header: false,
  });
};

export const handleDeleteConfirm = <TData,>(
  onDataLoaded: (data: TData[], columns: string[]) => void,
  setIsDeleteModalOpen: (open: boolean) => void
) => {
  onDataLoaded([] as TData[], []);
  toast({
    description: "Data deleted",
  });
  setIsDeleteModalOpen(false);
};

export const handleReplaceConfirm = <TData>(
  pendingFile: File | null,
  onDataLoaded: (data: TData[], columns: string[]) => void,
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
