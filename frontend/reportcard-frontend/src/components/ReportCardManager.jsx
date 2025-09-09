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

  // Fetch records
  useEffect(() => {
    fetch(config.backendUrl)
      .then((res) => res.json())
      .then((data) => setRecords(data))
      .catch((err) => console.error("Error fetching:", err));
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentId || !formData.name || !formData.subject || !formData.marks) return;

    if (editingRecord) {
      // Update
      const updated = { ...editingRecord, ...formData, marks: parseInt(formData.marks) };
      await fetch(`${config.backendUrl}/${updated.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
      setRecords((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      setEditingRecord(null);
    } else {
      // Add
      const res = await fetch(config.backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, marks: parseInt(formData.marks) })
      });
      const data = await res.json();
      setRecords((prev) => [...prev, data]);
    }

    setFormData({ studentId: "", name: "", subject: "", marks: "" });
  };

  const deleteReport = async (id) => {
    await fetch(`${config.backendUrl}/${id}`, { method: "DELETE" });
    setRecords((prev) => prev.filter((r) => r.id !== id));
    // After deletion, editingRecord should reset if it was deleted
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
      <h1>📘 Report Card Manager</h1>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <input name="studentId" value={formData.studentId} placeholder="Student ID" onChange={handleChange} />
        <input name="name" value={formData.name} placeholder="Name" onChange={handleChange} />
        <input name="subject" value={formData.subject} placeholder="Subject" onChange={handleChange} />
        <input name="marks" type="number" value={formData.marks} placeholder="Marks" onChange={handleChange} />
        <button type="submit">{editingRecord ? "Update" : "Add"}</button>
      </form>

      {/* List */}
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Student ID</th><th>Name</th><th>Subject</th><th>Marks</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, index) => (
            <tr key={r.id}>
              {/* Dynamic serial number */}
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