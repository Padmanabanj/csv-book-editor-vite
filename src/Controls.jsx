import React from "react";

export default function Controls({
  onFileUpload,
  onGenerateDummy,
  onDownload,
  onReset,
  filter,
  setFilter,
}) {
  return (
    <div className="controls">
      <input type="file" accept=".csv" onChange={onFileUpload} />
      <button onClick={onGenerateDummy}>Generate Dummy Data</button>
      <button onClick={onDownload}>Download CSV</button>
      <button onClick={onReset}>Reset All</button>
      <input
        type="text"
        placeholder="Filter by Year or Author"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
    </div>
  );
}
