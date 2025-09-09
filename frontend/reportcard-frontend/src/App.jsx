import { useState, useEffect } from "react";
import ReportCardForm from "./components/ReportCardForm.jsx";
import ReportCardList from "./components/ReportCardList.jsx";
import config from "./config";
import "./index.css";

function App() {
  const [records, setRecords] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);

  // Fetch all report cards on mount
  useEffect(() => {
    fetch(config.backendUrl)
      .then((res) => res.json())
      .then((data) => setRecords(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  // Add
  const addReport = async (record) => {
    try {
      const res = await fetch(config.backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
      const data = await res.json();
      setRecords((prev) => [...prev, data]); // ✅ include backend response with id
    } catch (err) {
      console.error("Error adding report:", err);
    }
  };

  // Delete
  const deleteReport = async (id) => {
    try {
      await fetch(`${config.backendUrl}/${id}`, { method: "DELETE" });
      setRecords((prev) => prev.filter((r) => r.id !== id));
      if (editingRecord && editingRecord.id === id) setEditingRecord(null);
    } catch (err) {
      console.error("Error deleting report:", err);
    }
  };

  // Edit
  const editReport = (record) => setEditingRecord(record);

  // Update
  const updateReport = async (updatedRecord) => {
    try {
      const res = await fetch(`${config.backendUrl}/${updatedRecord.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRecord),
      });
      const data = await res.json();
      setRecords((prev) => prev.map((r) => (r.id === data.id ? data : r))); // ✅ replace correctly
      setEditingRecord(null);
    } catch (err) {
      console.error("Error updating report:", err);
    }
  };

  return (
    <div className="container">
      <h1>📘 Report Card System</h1>
      <ReportCardForm
        onAdd={addReport}
        onUpdate={updateReport}
        editingRecord={editingRecord}
      />
      <ReportCardList
        records={records}
        onDelete={deleteReport}
        onEdit={editReport}
      />
    </div>
  );
}

export default App;
