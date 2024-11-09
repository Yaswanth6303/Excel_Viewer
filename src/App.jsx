import { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";

function App() {
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 30;

  const handleFile = (e) => {
    const fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        const reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFile(e.target.result);
        };
      } else {
        setTypeError("Please select only Excel file types");
        setExcelFile(null);
      }
    }
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(data);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  const handleManualSearchChange = (key, value) => {
    setSearchQuery((prevQuery) => ({
      ...prevQuery,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  const getUniqueValues = (key) => {
    if (!excelData) return [];
    const uniqueValues = new Set(
      excelData
        .map(
          (row) =>
            row[key] !== undefined && row[key] !== null
              ? row[key].toString().trim()
              : ""
        )
        .filter((value) => value !== "")
    );

    return Array.from(uniqueValues).sort();
  };

  const filteredData = excelData
    ? excelData.filter((row) =>
        Object.keys(filters).every(
          (key) => (filters[key] ? row[key] === filters[key] : true)
        ) &&
        Object.keys(searchQuery).every(
          (key) =>
            searchQuery[key]
              ? row[key]?.toString().toLowerCase().includes(searchQuery[key].toLowerCase())
              : true
        )
      )
    : [];

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const resetFilters = () => {
    setFilters({});
    setSearchQuery({});
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h3 className="text-lg font-bold mb-4">Upload & View Excel Sheets</h3>

      {/* Upload Form */}
      <form
        className="flex flex-col gap-4 w-full max-w-md"
        onSubmit={handleFileSubmit}
      >
        <input
          type="file"
          className="p-2 border border-gray-300 rounded"
          required
          onChange={handleFile}
        />
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded"
        >
          UPLOAD
        </button>
        {typeError && <div className="text-red-500">{typeError}</div>}
      </form>

      {/* Manual Search Form (Top of the Page) */}
      <div className="mt-8 mb-4">
        <h4 className="text-lg font-bold">Manual Search</h4>
        <form className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {excelData &&
            Object.keys(excelData[0]).map((key) => (
              <div key={key} className="flex flex-col">
                <label htmlFor={key} className="text-sm font-semibold">{key}</label>
                <input
                  type="text"
                  id={key}
                  value={searchQuery[key] || ""}
                  onChange={(e) => handleManualSearchChange(key, e.target.value)}
                  className="p-2 border border-gray-300 rounded"
                  placeholder={`Search ${key}`}
                />
              </div>
            ))}
        </form>
      </div>

      {/* Filters and Data Table */}
      <div className="mt-8 overflow-x-auto">
        {excelData && (
          <table className="min-w-[1000px] bg-white border border-gray-200">
            <thead className="sticky top-0 bg-gray-100 z-10">
              <tr>
                {Object.keys(excelData[0]).map((key) => (
                  <th
                    key={key}
                    className="px-4 py-2 border-b min-w-[150px] max-w-[250px] text-sm font-medium"
                  >
                    <div>{key}</div>

                    {/* Filter Dropdown */}
                    <select
                      className="w-full p-1 text-sm border border-gray-300 rounded"
                      value={filters[key] || ""}
                      onChange={(e) => handleFilterChange(key, e.target.value)}
                    >
                      <option value="">All</option>
                      {getUniqueValues(key).map((value, index) => (
                        <option key={index} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <tr key={index} className="even:bg-gray-50">
                    {Object.keys(row).map((key) => (
                      <td
                        key={key}
                        className="px-4 py-2 border-b min-w-[150px] max-w-[250px] text-sm"
                      >
                        {row[key]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={Object.keys(excelData[0]).length}
                    className="px-4 py-2 text-center"
                  >
                    No data found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        {!excelData && <p className="text-gray-500">No file is uploaded yet!</p>}
      </div>

      {/* Pagination Controls */}
      {excelData && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={resetFilters}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Reset
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={handlePreviousPage}
              className="bg-gray-500 text-white py-2 px-4 rounded"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              className="bg-gray-500 text-white py-2 px-4 rounded"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
