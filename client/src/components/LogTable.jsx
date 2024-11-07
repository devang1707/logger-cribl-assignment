import React from 'react';
import '../styles/LogTable.css';

const LogTable = React.memo(
  ({ logs, totalCount, isLoading, page, onPageChange }) => {
    // Your existing LogTable code here
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
                      <tr key={index}>
                        <td>
                          {log._time
                            ? new Date(log._time).toISOString()
                            : 'Invalid timestamp'}
                        </td>
                        <td>{JSON.stringify(log)}</td>
                      </tr>
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
