
import * as XLSX from "xlsx";

const AExcel = () => {
  const data = [
    { id: 1, name: "Alice", age: 25 },
    { id: 2, name: "Bob", age: 30 },
    { id: 3, name: "Charlie", age: 28 },
  ];

  const exportToExcel = () => {
    // 1️⃣ Create a worksheet from JSON
    const worksheet = XLSX.utils.json_to_sheet(data);

    console.log(worksheet)
    // 2️⃣ Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();

    console.log(workbook)
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    // 3️⃣ Export the file
    XLSX.writeFile(workbook, "users_data.xlsx");
  };

  return (
    <button
      onClick={exportToExcel}
      style={{
        padding: "10px 20px",
        borderRadius: "8px",
        background: "#007bff",
        color: "#fff",
        border: "none",
        cursor: "pointer",
      }}
    >
      Export to Excel
    </button>
  );
};

export default AExcel;
