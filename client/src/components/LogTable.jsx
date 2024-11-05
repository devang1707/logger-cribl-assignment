import React, { useState, useEffect } from 'react';
import '../styles/LogTable.css'; // Adjust the path if necessary

export default function LogTable() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const limit = 20;

  useEffect(() => {
    setIsLoading(true);
    const eventSource = new EventSource(
      `/api/logs/pagination?page=${page}&limit=${limit}`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.error) {
        console.error('Error:', data.error);
        setLogs([]);
        setTotalCount(0);
      } else {
        setLogs((prevLogs) => [...prevLogs, ...data.logs]);
        setTotalCount(data.totalCount);
      }
      setIsLoading(false);
    };

    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      setIsLoading(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setLogs([]); // Clear logs for new page
  };

  const toggleRow = (index) => {
    const newExpandedRows = new Set();
    if (expandedRows.has(index)) {
    } else {
      newExpandedRows.add(index);
    }
    setExpandedRows(newExpandedRows);
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div>
      <h3>Logs Entry</h3>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div>
            Displaying page {page} of {totalPages} records
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
                {Array.isArray(logs) &&
                  logs.map((log, index) => (
                    <React.Fragment key={index}>
                      <tr onClick={() => toggleRow(index)}>
                        <td>
                          <span
                            style={{ cursor: 'pointer' }}
                            onClick={() => toggleRow(index)}
                          >
                            {expandedRows.has(index) ? '▼' : '>'}
                          </span>
                          {new Date(log._time).toISOString()}
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
                  ))}
              </tbody>
            </table>
          </div>
          <div>
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
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
