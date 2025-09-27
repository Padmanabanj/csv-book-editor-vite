export default function DataTable({ data, sortConfig, onSort, onEdit }) {
  return (
    <div className="table-container">
      <table className="styled-table">
        <thead>
          <tr>
            {data[0] &&
              Object.keys(data[0].row).map((key) => (
                <th key={key} onClick={() => onSort(key)}>
                  {key}{" "}
                  {sortConfig?.key === key
                    ? sortConfig.direction === "ascending"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {data.map(({ row, absoluteIndex }) => (
            <tr key={absoluteIndex}>
              {Object.entries(row).map(([key, value], colIndex) => (
                <td key={colIndex}>
                  <input
                    value={value}
                    onChange={(e) =>
                      onEdit(absoluteIndex, key, e.target.value)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
