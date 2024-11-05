import React, { useState, useEffect } from 'react';

export default function LogTable() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 20;

  useEffect(() => {
    setIsLoading(true);
    console.log('Creating EventSource connection for page:', page);
    const eventSource = new EventSource(
      `/api/logs/pagination?page=${page}&limit=${limit}`
    );

    eventSource.onmessage = (event) => {
      console.log('Received SSE data:', event.data);
      const data = JSON.parse(event.data);
      if (data.error) {
        console.error('Error:', data.error);
        setLogs([]);
        setTotalCount(0);
      } else {
        console.log('Setting logs:', data.logs);
        console.log('Setting totalCount:', data.totalCount);
        setLogs(data.logs);
        setTotalCount(data.totalCount);
      }
      setIsLoading(false);
      eventSource.close();
    };

    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      setIsLoading(false);
      eventSource.close();
    };

    return () => {
      console.log('Cleaning up EventSource connection');
      eventSource.close();
    };
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div>
      <h3>Logs Entry</h3>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Message</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(logs) &&
                logs.map((log, index) => (
                  <tr key={index}>
                    <td>{log?.timestamp}</td>
                    <td>{log?.message}</td>
                    <td>
                      {log?.timestamp
                        ? new Date(log.timestamp).toLocaleString()
                        : ''}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
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
