import React, { useEffect, useRef, useCallback } from 'react';
import '../styles/LogGraph.css'; // Adjust path as necessary

export default function LogGraph({ logs }) {
  const canvasRef = useRef(null);

  // Wrap drawGraph in useCallback
  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Process logs to group by hour and count occurrences
    const summary = processLogsForGraph(logs);

    // Get labels and values from the summary
    const labels = Object.keys(summary);
    const values = Object.values(summary);

    // Chart dimensions
    const chartHeight = canvas.height - 40;
    const chartWidth = canvas.width - 40;
    const barWidth = chartWidth / labels.length;

    // Find max value for scaling
    const maxValue = Math.max(...values);

    // Draw bars and labels
    values.forEach((value, index) => {
      const barHeight = (value / maxValue) * chartHeight;
      ctx.fillStyle = 'rgba(0, 188, 212, 0.6)';
      ctx.fillRect(
        20 + index * barWidth,
        chartHeight - barHeight + 20,
        barWidth - 10,
        barHeight
      );

      // Draw labels below each bar
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.fillText(
        labels[index],
        20 + index * barWidth + (barWidth - 10) / 2,
        chartHeight + 30
      );
    });
  }, [logs]); // Add logs as a dependency

  // Function to process logs and group them by hour
  const processLogsForGraph = (logs) => {
    const summary = {};

    logs.forEach((log) => {
      const timeKey = new Date(log.timestamp)
        .toISOString()
        .slice(0, 13); // Group by hour
      if (!summary[timeKey]) summary[timeKey] = 0;
      summary[timeKey]++;
    });

    return summary;
  };

  // Add drawGraph as a dependency in useEffect
  useEffect(() => {
    if (logs.length > 0) {
      drawGraph();
    }
  }, [logs, drawGraph]); // drawGraph is now stable

  return (
    <div className="timeline-component">
      <h3>Log Events Over Time</h3>
      <canvas ref={canvasRef} data-testid="log-graph-canvas"></canvas>
    </div>
  );
}
