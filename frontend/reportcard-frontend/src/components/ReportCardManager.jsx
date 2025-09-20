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
  const [pingStatus, setPingStatus] = useState("");

  // Load records from localStorage first
  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem("reportRecords")) || [];
    setRecords(localData);
    syncLocalToBackend(localData);
  }, []);

  // Sync localStorage records to backend
  const syncLocalToBackend = async (localData) => {
    if (!navigator.onLine) return; // Only sync if online

    const unsynced = localData.filter((r) => !r.synced);
    for (let r of unsynced) {
      try {
        const res = await fetch(`${config.backendUrl}/add`, {
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
          const saved = await res.json();
          r.id = saved.id; // update id from backend
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
      const res = await fetch(`${config.backendUrl}/all`);
      if (res.ok) {
        const data = await res.json();
        const syncedData = data.map((r) => ({ ...r, synced: true }));
        setRecords(syncedData);
        localStorage.setItem("reportRecords", JSON.stringify(syncedData));
      }
    } catch (err) {
      console.error("Error fetching records:", err);
    }
  };

  // Ping backend API
  const pingBackend = async () => {
    try {
      const res = await fetch(`${config.backendUrl}/reports/ping`);
      if (res.ok) {
        const text = await res.text();
        setPingStatus(`Backend Status: ${text}`);
      } else {
        setPingStatus("Backend is not responding");
      }
    } catch (err) {
      console.error("Ping error:", err);
      setPingStatus("Backend is not reachable");
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.studentId ||
      !formData.name ||
      !formData.subject ||
      formData.marks === ""
    )
      return;

    let newRecords = [...records];

    if (editingRecord) {
      // Update existing
      const updated = {
        ...editingRecord,
        ...formData,
        marks: parseInt(formData.marks)
      };
      try {
        if (navigator.onLine) {
          await fetch(`${config.backendUrl}/update/${updated.id}`, {
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
      newRecords = newRecords.map((r) => (r.id === updated.id ? updated : r));
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
          const res = await fetch(`${config.backendUrl}/add`, {
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
    let newRecords = records.filter((r) => r.id !== id);

    const record = records.find((r) => r.id === id);
    if (record && record.synced && navigator.onLine) {
      try {
        await fetch(`${config.backendUrl}/delete/${id}`, { method: "DELETE" });
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

      {/* Ping backend */}
      <button onClick={pingBackend}>Ping Backend</button>
      {pingStatus && <p>{pingStatus}</p>}

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
            <th>#</th>
            <th>Student ID</th>
            <th>Name</th>
            <th>Subject</th>
            <th>Marks</th>
            <th>Synced</th>
            <th>Actions</th>
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
              <td>{r.synced ? "Yes" : "No"}</td>
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
