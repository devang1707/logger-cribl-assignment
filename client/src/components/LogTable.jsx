import React, { useState } from 'react';
import '../styles/LogTable.css'; // Adjust the path if necessary

export default function LogTable({
  logs,
  totalCount,
  isLoading,
  page,
  limit,
  onPageChange,
}) {
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRow = (index) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(index)) {
      newExpandedRows.delete(index); // Collapse row
    } else {
      newExpandedRows.add(index); // Expand row
    }
    setExpandedRows(newExpandedRows);
  };

  const totalPages = Math.ceil(totalCount / limit) || 1; // Ensure totalPages is at least 1

  return (
    <div>
      <h3>Logs Entry</h3>
      {/* Conditionally render based on loading state */}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div>
            Displaying page {page} of {totalPages} records{' '}
            {/* Safely display totalPages */}
          </div>
          <div className="log-table-container">
            <table className="log-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Event</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(logs) && logs.length > 0 ? (
                  logs.map((log, index) => (
                    <React.Fragment key={index}>
                      <tr onClick={() => toggleRow(index)}>
                        <td>
                          <span style={{ cursor: 'pointer' }}>
                            {expandedRows.has(index) ? '▼' : '>'}
                          </span>
                          {log.timestamp
                            ? new Date(log.timestamp).toISOString()
                            : 'Invalid timestamp'}
                        </td>
                        <td>{JSON.stringify(log)}</td>
                      </tr>
                      {expandedRows.has(index) && (
                        <tr>
                          <td colSpan="2">
                            <pre>{JSON.stringify(log, null, 2)}</pre>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2">No logs available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          <div className="pagination-controls">
            {/* Previous Button */}
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>

            {/* Display current page */}
            <span>
              Page {page} of {totalPages}
            </span>

            {/* Next Button */}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
