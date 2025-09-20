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

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await fetch(`${config.backendUrl}/all`);
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      }
    } catch (err) {
      console.error("Error fetching records:", err);
    }
  };

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
      setPingStatus("Backend is not reachable");
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentId || !formData.name || !formData.subject || formData.marks === "") return;

    if (editingRecord) {
      // Update existing
      try {
        await fetch(`${config.backendUrl}/update/${formData.studentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, marks: parseInt(formData.marks) })
        });
        setEditingRecord(null);
      } catch (err) {
        console.error("Error updating record:", err);
      }
    } else {
      // Add new
      try {
        await fetch(`${config.backendUrl}/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, marks: parseInt(formData.marks) })
        });
      } catch (err) {
        console.error("Error adding record:", err);
      }
    }

    setFormData({ studentId: "", name: "", subject: "", marks: "" });
    fetchRecords();
  };

  const deleteReport = async (studentId) => {
    try {
      await fetch(`${config.backendUrl}/delete/${studentId}`, { method: "DELETE" });
      fetchRecords();
    } catch (err) {
      console.error("Error deleting record:", err);
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

      <button onClick={pingBackend}>Ping Backend</button>
      {pingStatus && <p>{pingStatus}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="studentId"
          value={formData.studentId}
          placeholder="Student ID"
          onChange={handleChange}
          disabled={!!editingRecord} // studentId can't be changed while editing
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

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Student ID</th>
            <th>Name</th>
            <th>Subject</th>
            <th>Marks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, index) => (
            <tr key={r.studentId}>
              <td>{index + 1}</td>
              <td>{r.studentId}</td>
              <td>{r.name}</td>
              <td>{r.subject}</td>
              <td>{r.marks}</td>
              <td>
                <button onClick={() => editReport(r)}>Edit</button>
                <button onClick={() => deleteReport(r.studentId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportCardManager;
