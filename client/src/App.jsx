import React, { useState, useEffect } from 'react';
import './styles/App.css';
import LogTable from './components/LogTable';
import LogGraph from './components/LogGraph';

function App() {
  const [logs, setLogs] = useState([]); // Initialize logs as an empty array
  const [totalCount, setTotalCount] = useState(0); // Initialize totalCount as 0
  const [isLoading, setIsLoading] = useState(true); // Start with loading state as true
  const limit = 50;
  const [page, setPage] = useState(1);

  useEffect(() => {
    setIsLoading(true); // Set loading to true when fetching starts
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/logs/pagination?page=${page}&limit=${limit}`
        );

        if (!response.ok) {
          const errorData = await response.text();
          console.error('Error:', errorData);
          setLogs([]);
          setTotalCount(0);
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let result = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          result += decoder.decode(value, { stream: true });
        }

        const jsonData = result
          .split('\n')
          .filter((line) => line)
          .map((line) => {
            const jsonString = line.replace(/^data: /, '');
            return JSON.parse(jsonString);
          });

        // Check if jsonData is not empty before destructuring
        if (jsonData.length === 0) {
          console.error('No data received from the API');
          setLogs([]);
          setTotalCount(0);
          setIsLoading(false);
          return;
        }

        const { logs, totalCount } = jsonData[jsonData.length - 1];

        setLogs(logs || []);
        setTotalCount(totalCount || 0);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching logs:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page]);

  return (
    <div className="App">
      <h1>Log Viewer Dashboard</h1>
      <LogGraph logs={logs} />
      <LogTable
        logs={logs}
        totalCount={totalCount}
        isLoading={isLoading}
        page={page}
        limit={limit}
        onPageChange={setPage}
      />
    </div>
  );
}

export default App;
