import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface CSVData {
  data: Record<string, any>[];
  columns: string[];
}

interface ContextProps {
  csvData: CSVData | null;
  setCSVData: (csvData: CSVData) => void;
}

const CSVContext = createContext<ContextProps | undefined>(undefined);

interface ProviderProps {
  children: ReactNode;
}

export const CSVProvider: React.FC<ProviderProps> = ({ children }) => {
  const [csvData, setCSVDataState] = useState<CSVData | null>(null);

  const getCSVData = (): CSVData | null => {
    const dataJson = localStorage.getItem("csvData");
    if (!dataJson) return null;
    return JSON.parse(dataJson);
  };

  const saveCSVData = (data: CSVData) => {
    const dataJson = JSON.stringify(data);
    localStorage.setItem("csvData", dataJson);
  };

  const setCSVData = (data: CSVData) => {
    setCSVDataState(data);
    saveCSVData(data);
  };

  useEffect(() => {
    const storedData = getCSVData();
    if (storedData) {
      setCSVDataState(storedData);
    }
  }, []);

  return (
    <CSVContext.Provider value={{ csvData, setCSVData }}>
      {children}
    </CSVContext.Provider>
  );
};

export const useCSV = () => {
  const context = useContext(CSVContext);
  if (!context) {
    throw new Error("useCSV must be used within a CSVProvider");
  }
  return context;
};
