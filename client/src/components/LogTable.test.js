import React from 'react';
import { render, screen } from '@testing-library/react';
import LogTable from './LogTable';

describe('LogTable Component', () => {
  const logs = [
    {
      timestamp: '2024-08-22T10:46:52.592Z',
      message: 'Test log message 1',
    },
    {
      timestamp: '2024-08-22T10:46:16.596Z',
      message: 'Test log message 2',
    },
  ];

  test('renders loading state', () => {
    render(
      <LogTable
        logs={[]}
        isLoading={true}
        totalCount={0}
        page={1}
        limit={20}
      />
    );
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test('renders logs correctly', () => {
    render(
      <LogTable
        logs={logs}
        isLoading={false}
        totalCount={2}
        page={1}
        limit={20}
      />
    );

    expect(
      screen.getByText(/Test log message 1/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Test log message 2/i)
    ).toBeInTheDocument();
  });

  test('renders "No logs available" when logs are empty', () => {
    render(
      <LogTable
        logs={[]}
        isLoading={false}
        totalCount={0}
        page={1}
        limit={20}
      />
    );
    expect(
      screen.getByText(/No logs available/i)
    ).toBeInTheDocument();
  });
});
