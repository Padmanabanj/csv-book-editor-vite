export default function DataTable({ data, sortConfig, onSort, onEdit }) {
  const textAl = {
  textAlign: "center"
};
// console.log(data)
  return (
    <div className="table-container">
      {data && data.length > 0 ? (<table className="styled-table">
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
      </table>) : (<h4 style={textAl}>No Data</h4>)
      }
      
    </div>
  );
}
