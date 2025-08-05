import { createContext, useContext, useRef, useState } from 'react';
import { useSim } from './SimProvider';


type FileContextProviderProps = {
  children: React.ReactNode;
};

type FileContextType = {
  graphName: string;
  SaveButton: () => JSX.Element;
  LoadButton: () => JSX.Element;
  FileInput: () => JSX.Element;
};

export const FileContext = createContext({} as FileContextType);

export const FileProvider = ({ children }: FileContextProviderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { saveState, dispatchSaveState } = useSim();
  const [ graphName, setGraphName ] = useState<string>('New Graph');

  //=================================================================================
  // Util

  const stripExtension = (filename: string) => {
    return filename.endsWith('.json') ? filename.slice(0, filename.length - 5) : filename;
  };
  
  //=================================================================================
  // Save

  const handleSaveClick = () => {
    let filename = prompt("Enter filename:", `${stripExtension(graphName)}`) || undefined;
    if (!filename) return; 
    const json = JSON.stringify(saveState, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.json`; // filename from prompt
    a.click();
    URL.revokeObjectURL(url);

    setGraphName(filename);
  };

  //=================================================================================
  // Load

  const handleLoadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // <-- Clear previous file
      fileInputRef.current.click();
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const contents = event.target?.result;
        const parsed = JSON.parse(contents as string);
        // Set sim save state
        dispatchSaveState({partial: parsed, init: true});
        setGraphName(stripExtension(file.name));
      } catch (err) {
        alert('Invalid JSON file');
      };
    };
    reader.readAsText(file);
  };

  //=================================================================================
  // Components

  const SaveButton = () => <button onClick={handleSaveClick}>Save</button>;
  const LoadButton = () => <button onClick={handleLoadClick}>Load</button>;
  
  // Invisible but required to load the file
  const FileInput = () => <input
    ref={fileInputRef}
    type="file"
    accept=".json"
    onChange={handleFileChange}
    style={{ display: 'none' }}
  />;

  //=========================================================================================
  return (
    <FileContext.Provider
      value={{
        graphName,
        SaveButton,
        LoadButton,
        FileInput
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

//=========================================================================================
export const useFile = () => {
  const context = useContext(FileContext);
  return context;
};