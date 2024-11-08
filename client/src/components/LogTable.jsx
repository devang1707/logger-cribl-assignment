import React from 'react';
import '../styles/LogTable.css';

const LogTable = React.memo(
  ({ logs, totalCount, isLoading, page, onPageChange }) => {
    const [expandedRows, setExpandedRows] = React.useState(new Set());

    const toggleRow = (index) => {
      const newExpandedRows = new Set(expandedRows);
      if (expandedRows.has(index)) {
        newExpandedRows.delete(index); // Collapse row
      } else {
        newExpandedRows.add(index); // Expand row
      }
      setExpandedRows(newExpandedRows);
    };

    return (
      <div>
        <h3>Logs Entry</h3>
        {/* Conditionally render based on loading state */}
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div>
              Displaying page {page} of {Math.ceil(totalCount / 100)}{' '}
              records
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
                            {log._time
                              ? new Date(log._time).toISOString()
                              : 'Invalid timestamp'}
                          </td>
                          <td>{JSON.stringify(log)}</td>
                        </tr>
                        {expandedRows.has(index) && (
                          <tr>
                            <td colSpan="2">
                              <pre>
                                {JSON.stringify(log, null, 2)}
                              </pre>
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
          </>
        )}
      </div>
    );
  }
);

export default LogTable;
