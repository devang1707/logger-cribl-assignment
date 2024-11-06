import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';
import { createCanvas } from 'canvas';
import { TextDecoder, TextEncoder } from 'text-encoding';

beforeEach(() => {
  // Mock ReadableStream
  global.ReadableStream = class {
    constructor({ start }) {
      this.controller = {
        enqueue: jest.fn(),
        close: jest.fn(),
      };
      start(this.controller);
    }

    getReader() {
      return {
        read: jest
          .fn()
          .mockResolvedValueOnce({
            done: false,
            value: new TextEncoder().encode(
              'data: {"logs":[{"timestamp":"2024-08-22T10:46:52.592Z","message":"Test log message"}],"totalCount":1}\n'
            ),
          })
          .mockResolvedValueOnce({ done: true }), // Mark the stream as done after the first read
      };
    }
  };

  // Mock fetch
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      body: new global.ReadableStream({
        start(controller) {
          controller.enqueue(
            new TextEncoder().encode(
              'data: {"logs":[{"timestamp":"2024-08-22T10:46:52.592Z","message":"Test log message"}],"totalCount":1}\n'
            )
          );
          controller.close(); // Ensure the stream is closed
        },
      }),
      text: () =>
        Promise.resolve(
          'data: {"logs":[{"timestamp":"2024-08-22T10:46:52.592Z","message":"Test log message"}],"totalCount":1}\n'
        ),
    })
  );

  // Mock TextDecoder and TextEncoder
  global.TextDecoder = class {
    decode(value) {
      return new TextDecoder('utf-8').decode(value);
    }
  };

  global.TextEncoder = TextEncoder;

  // Mock HTMLCanvasElement prototype for canvas functionality
  HTMLCanvasElement.prototype.getContext = function () {
    return createCanvas().getContext('2d');
  };
});

describe('App Component', () => {
  test('renders App component with loading state initially', async () => {
    jest.setTimeout(10000);
    render(<App />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    const logMessage = await screen.findByText(/Test log message/i);
    expect(logMessage).toBeInTheDocument();
  });
});
