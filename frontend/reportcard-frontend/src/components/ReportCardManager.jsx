import { useState, useEffect } from "react";
import config from "./config";
import "../index.css";
import "./style.css";

function ReportCardManager() {
  const [records, setRecords] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    subject: "",
    marks: ""
  });

  // Load records from localStorage first
  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem("reportRecords")) || [];
    setRecords(localData);
    // Try to sync with backend
    syncLocalToBackend(localData);
  }, []);

  // Sync localStorage records to backend
  const syncLocalToBackend = async (localData) => {
    if (!navigator.onLine) return; // Only sync if online

    const unsynced = localData.filter(r => !r.synced);
    for (let r of unsynced) {
      try {
        const res = await fetch(config.backendUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: r.studentId,
            name: r.name,
            subject: r.subject,
            marks: parseInt(r.marks)
          })
        });
        if (res.ok) {
          r.synced = true;
        }
      } catch (err) {
        console.error("Error syncing record:", err);
      }
    }
    localStorage.setItem("reportRecords", JSON.stringify(localData));
    fetchRecords(); // Refresh from backend
  };

  // Fetch records from backend
  const fetchRecords = async () => {
    try {
      const res = await fetch(config.backendUrl);
      if (res.ok) {
        const data = await res.json();
        // Mark all records as synced for localStorage
        const syncedData = data.map(r => ({ ...r, synced: true }));
        setRecords(syncedData);
        localStorage.setItem("reportRecords", JSON.stringify(syncedData));
      }
    } catch (err) {
      console.error("Error fetching records:", err);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentId || !formData.name || !formData.subject || formData.marks === "")
      return;

    let newRecords = [...records];

    if (editingRecord) {
      // Update existing
      const updated = { ...editingRecord, ...formData, marks: parseInt(formData.marks) };
      try {
        if (navigator.onLine) {
          await fetch(`${config.backendUrl}/${updated.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated)
          });
          updated.synced = true;
        } else {
          updated.synced = false;
        }
      } catch (err) {
        console.error("Error updating backend:", err);
        updated.synced = false;
      }
      newRecords = newRecords.map(r => r.id === updated.id ? updated : r);
      setEditingRecord(null);
    } else {
      // Add new
      const newRecord = {
        id: Date.now(), // temporary id for localStorage
        ...formData,
        marks: parseInt(formData.marks),
        synced: false
      };

      if (navigator.onLine) {
        try {
          const res = await fetch(config.backendUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              studentId: newRecord.studentId,
              name: newRecord.name,
              subject: newRecord.subject,
              marks: newRecord.marks
            })
          });
          if (res.ok) {
            const saved = await res.json();
            newRecord.id = saved.id;
            newRecord.synced = true;
          }
        } catch (err) {
          console.error("Error posting to backend:", err);
        }
      }

      newRecords.push(newRecord);
    }

    setRecords(newRecords);
    localStorage.setItem("reportRecords", JSON.stringify(newRecords));
    setFormData({ studentId: "", name: "", subject: "", marks: "" });
    fetchRecords();
  };

  const deleteReport = async (id) => {
    let newRecords = records.filter(r => r.id !== id);

    const record = records.find(r => r.id === id);
    if (record && record.synced && navigator.onLine) {
      try {
        await fetch(`${config.backendUrl}/${id}`, { method: "DELETE" });
      } catch (err) {
        console.error("Error deleting backend record:", err);
      }
    }

    setRecords(newRecords);
    localStorage.setItem("reportRecords", JSON.stringify(newRecords));
    if (editingRecord && editingRecord.id === id) {
      setEditingRecord(null);
      setFormData({ studentId: "", name: "", subject: "", marks: "" });
    }
  };

  const editReport = (record) => {
    setEditingRecord(record);
    setFormData({
      studentId: record.studentId,
      name: record.name,
      subject: record.subject,
      marks: record.marks
    });
  };

  return (
    <div className="container">
      <h1>Report Card Manager</h1>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <input
          name="studentId"
          value={formData.studentId}
          placeholder="Student ID"
          onChange={handleChange}
        />
        <input
          name="name"
          value={formData.name}
          placeholder="Name"
          onChange={handleChange}
        />
        <input
          name="subject"
          value={formData.subject}
          placeholder="Subject"
          onChange={handleChange}
        />
        <input
          name="marks"
          type="number"
          value={formData.marks}
          placeholder="Marks"
          onChange={handleChange}
        />
        <button type="submit">{editingRecord ? "Update" : "Add"}</button>
      </form>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Student ID</th><th>Name</th><th>Subject</th><th>Marks</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, index) => (
            <tr key={r.id}>
              <td>{index + 1}</td>
              <td>{r.studentId}</td>
              <td>{r.name}</td>
              <td>{r.subject}</td>
              <td>{r.marks}</td>
              <td>
                <button onClick={() => editReport(r)}>Edit</button>
                <button onClick={() => deleteReport(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportCardManager;
