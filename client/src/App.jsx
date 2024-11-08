import React, { useState, useEffect, useMemo } from 'react';
import './styles/App.css';
import LogTable from './components/LogTable';
import LogGraph from './components/LogGraph';

const LOG_URL =
  'https://s3.amazonaws.com/io.cribl.c021.takehome/cribl.log'; // Store URL in a constant

function App() {
  const [logs, setLogs] = useState([]); // Initialize logs as an empty array
  const [totalCount, setTotalCount] = useState(0); // Initialize totalCount as 0
  const [isLoading, setIsLoading] = useState(true); // Start with loading state as true
  const [page, setPage] = useState(1);
  const pageSize = 100; // Define the number of logs per page

  const fetchLogs = async () => {
    setIsLoading(true); // Set loading to true when fetching starts
    try {
      const response = await fetch(`${LOG_URL}`); // Fetch logs without pagination
      if (!response.ok) {
        console.error('Error fetching logs:', await response.text());
        setLogs([]);
        setTotalCount(0);
        setIsLoading(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let result = '';
      let allLogs = []; // Store all logs

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode current chunk
        result += decoder.decode(value, { stream: true });

        // Process each line as it arrives
        const lines = result.split('\n');
        result = lines.pop(); // Keep incomplete last line

        const newLogs = lines
          .filter((line) => line)
          .map((line) => {
            const jsonString = line.replace(/^data: /, '');
            return JSON.parse(jsonString);
          });

        // Update logs state progressively
        allLogs = [...allLogs, ...newLogs]; // Append new logs to allLogs

        setLogs(allLogs); // Update state with all logs
        setTotalCount(allLogs.length); // Update total count with fetched logs
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(); // Fetch logs once on component mount
  }, []); // Empty dependency array to run only once

  // Memoize the paginated logs to avoid recalculating on every render
  const paginatedLogs = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return logs.slice(startIndex, startIndex + pageSize);
  }, [logs, page]); // Recalculate when logs or page changes

  const handleNextPage = () => {
    if (page * pageSize < totalCount) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="App">
      <h1>Log Viewer Dashboard</h1>
      <LogGraph logs={paginatedLogs} />
      <div className="pagination-controls">
        <button onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </button>
        <span>
          Page {page} of {Math.ceil(totalCount / pageSize)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page * pageSize >= totalCount}
        >
          Next
        </button>
      </div>
      <LogTable
        logs={paginatedLogs}
        totalCount={totalCount}
        isLoading={isLoading}
        page={page}
        onPageChange={setPage}
      />
    </div>
  );
}

export default App;
