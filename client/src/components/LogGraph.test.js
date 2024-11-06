import React from 'react';
import { render, screen } from '@testing-library/react';
import LogGraph from './LogGraph';

describe('LogGraph Component', () => {
  const logs = [
    {
      timestamp: '2024-08-22T10:46:52.592Z',
      message: 'Test log message',
    },
    {
      timestamp: '2024-08-22T10:46:16.596Z',
      message: 'Another test log message',
    },
  ];

  test('renders canvas element', () => {
    render(<LogGraph logs={logs} />);
    const canvas = screen.getByTestId('log-graph-canvas');

    expect(canvas).toBeInTheDocument();
  });

  test('does not render graph when no logs are provided', () => {
    render(<LogGraph logs={[]} />);
    const canvas = screen.getByTestId('log-graph-canvas');

    expect(canvas).toBeInTheDocument();
  });
});
