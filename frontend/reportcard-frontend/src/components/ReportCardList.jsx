function ReportCardList({ records, onDelete, onEdit }) {
  return (
    <div>
      <h2>Report Cards</h2>
      <table className="report-table">
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Student ID</th>
            <th>Name</th>
            <th>Subject</th>
            <th>Marks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>{record.id}</td>
              <td>{record.studentId}</td>
              <td>{record.name}</td>
              <td>{record.subject}</td>
              <td>{record.marks}</td>
              <td>
                <div className="action-buttons">
                  <button
                    className="delete-btn"
                    onClick={() => onDelete(record.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="edit-btn"
                    onClick={() => onEdit(record)}
                  >
                    Edit
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportCardList;
