import React, { useRef } from 'react';
import { useSim } from '../../contexts/SimProvider';



const FileHandler: React.FC = () => {
  const { dispatchSaveState } = useSim();

  const fileInputRef = useRef<HTMLInputElement>(null);

  //=================================================================================
  // Save

  const handleSaveClick = () => {
    const filename = prompt("Enter filename:") || "";
    if (!filename) return;
    const data = { message: "Hello world!", timestamp: new Date().toISOString() };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename; // filename from prompt
    a.click();
    URL.revokeObjectURL(url);
  };

  //=================================================================================
  // Load

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const contents = event.target?.result;
        const parsed = JSON.parse(contents as string);
        console.log('Loaded data:', parsed);
        dispatchSaveState({partial: parsed});
        // Do something with parsed data here
      } catch (err) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  //=================================================================================
  return (
    <div style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem' }}>
      <button onClick={handleLoadClick}>Load</button>
      <button onClick={handleSaveClick}>Save</button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export {FileHandler};
