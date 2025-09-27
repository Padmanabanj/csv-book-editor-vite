import React, { useState } from "react";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { faker } from "@faker-js/faker";
import Controls from "./Controls";
import DataTable from "./DataTable";
import { deepClone } from "./utils/csvHelpers";
import SkeletonTable from "./SkeletonTable";
import "./App.css";

export default function App() {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortConfig, setSortConfig] = useState(null);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 100;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setTimeout(() => {
          const parsed = results.data;
          setData(parsed);
          setOriginalData(JSON.parse(JSON.stringify(parsed)));
          setLoading(false);
        }, 1200);
      },
    });
  };

  const generateDummyData = () => {
    setLoading(true);
    setTimeout(() => {
      const books = Array.from({ length: 1000 }, () => ({
        Title: faker.lorem.words(3),
        Author: faker.person.fullName(),
        Genre: faker.helpers.arrayElement([
          "Fiction",
          "Non-Fiction",
          "Mystery",
          "Sci-Fi",
          "Fantasy",
          "Romance",
        ]),
        PublishedYear: faker.date.past({ years: 70 }).getFullYear(),
        ISBN: faker.string.numeric(13),
      }));
      setData(books);
      setOriginalData(JSON.parse(JSON.stringify(books)));
      setLoading(false);
      setCurrentPage(1); // reset to page 1
    }, 1500);
  };

  const handleEdit = (rowIndex, key, value) => {
    console.log(rowIndex, key, value)
    const updated = [...data];
    updated[rowIndex][key] = value;
    setData(updated);
  };

  const handleDownload = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "books.csv");
  };

  const resetEdits = () => {
    setData(deepClone(originalData));
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    const sorted = [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });
    setData(sorted);
    setSortConfig({ key, direction });
  };

  // filtering
  const filteredData = data.filter(
    (row) =>
      row.Title?.toLowerCase().includes(filter.toLowerCase()) ||
      row.Author?.toLowerCase().includes(filter.toLowerCase()) ||
      String(row.PublishedYear)?.includes(filter)
  );

  //pagination
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = filteredData.slice(startIndex, endIndex);
  const currentRowsWithIndex = currentRows.map((row, idx) => ({
  row,
  absoluteIndex: startIndex + idx
}));
  // console.log("current rows", currentRows)
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className="app-container">
      <h1 className="app-title">📚 CSV Book Editor</h1>

      <Controls
        onFileUpload={handleFileUpload}
        onGenerateDummy={generateDummyData}
        onDownload={handleDownload}
        onReset={resetEdits}
        filter={filter}
        setFilter={setFilter}
      />

      {loading ? (
        <SkeletonTable rows={12} cols={5} />
      ) : (
        <>
          <DataTable
            data={currentRowsWithIndex}
            sortConfig={sortConfig}
            onSort={handleSort}
            onEdit={handleEdit}
          />

          {/* ✅ Pagination Controls */}
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
