function ReportCardList({ records, onDelete, onEdit }) {
  return (
    <div>
      <h2>Report Cards</h2>
      <ul>
        {records.map((record) => (
          <li key={record.id}>
            <span>
              Student ID: {record.studentId} | {record.name} | {record.subject} | {record.marks} marks
            </span>
            <div className="actions">
              <button onClick={() => onDelete(record.id)}>❌ Delete</button>
              <button onClick={() => onEdit(record)}>✏️ Edit</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReportCardList;
