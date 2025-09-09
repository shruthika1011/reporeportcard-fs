import { useState, useEffect } from "react";

function ReportCardForm({ onAdd, onUpdate, editingRecord }) {
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [marks, setMarks] = useState("");

  // Pre-fill form when editing
  useEffect(() => {
    if (editingRecord) {
      setStudentId(editingRecord.studentId);
      setName(editingRecord.name);
      setSubject(editingRecord.subject);
      setMarks(editingRecord.marks);
    }
  }, [editingRecord]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentId || !name || !subject || !marks) return;

    const recordData = {
      studentId,
      name,
      subject,
      marks: parseInt(marks),
    };

    if (editingRecord) {
      onUpdate({ ...editingRecord, ...recordData });
    } else {
      onAdd(recordData);
    }

    // Reset form
    setStudentId("");
    setName("");
    setSubject("");
    setMarks("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        placeholder="Student ID"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        min="1"
      />
      <input
        type="text"
        placeholder="Student Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <input
        type="number"
        placeholder="Marks"
        value={marks}
        onChange={(e) => setMarks(e.target.value)}
      />
      <button type="submit">
        {editingRecord ? "Update Report" : "Add Report"}
      </button>
    </form>
  );
}

export default ReportCardForm;
