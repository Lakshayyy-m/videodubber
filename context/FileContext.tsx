"use client";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface FileContextType {
  fileURL: string;
  setFileURL: (mode: string) => void;
}

const FileContext = createContext<FileContextType>({
  fileURL: "",
  setFileURL: () => {},
});

const FileContextProvider = ({ children }: { children: ReactNode }) => {
  const [fileURL, setFileURL] = useState("");

  // useEffect(() => {
  //   setFileURL("");
  // }, [fileURL]);

  return (
    <FileContext.Provider value={{ fileURL, setFileURL }}>
      {children}
    </FileContext.Provider>
  );
};

export function useFile() {
  const context = useContext(FileContext);

  // if (context === undefined) {
  //   throw new Error("useTheme must be used within a ThemeProvider");
  // }

  return context;
}

export { FileContext, FileContextProvider };
