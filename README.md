# logger-cribl-assignment

An App to display log files

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [Design](#design)
- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [API](#api)
- [Contributing](#contributing)

## Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). It consists of a client-side React application and a server-side Node.js application.

## Features

- View logs in a paginated format.
- Visualize log events over time with a graph.
- Loading state management for better user experience.

## Design

- [UI (React)] --> (fetch with API call) --> [Log File]

## Components

- UI - React

  - Fetches log data directly from the URL and use ReadableStream to start parsing.
  - Parse the NDJSON data format and store in user state.
  - use Progressive loading
  - Renders a table with 100 rows and pagination available to get next set of records.
  - use the local file to go through records
  - Renders a graph on top for the same table set displayed below. categorized by dates.
  - Changing the page changes the graph too.

## Installation

To install the project, follow these steps:

1. Clone the repository:

   ```bash
   git clone git@github.com:devang1707/logger-cribl-assignment.git
   cd logger-cribl-assignment
   ```

2. Install dependencies for both server and client:

## Usage

To run the application in development mode, use the following command:
we use concurrently to run both client and server.

```bash
npm run dev
npm run start
```

This command will start both the server and client concurrently. You can access the application at [http://localhost:3000](http://localhost:3000).

## Scripts

In the project directory, you can run:

```bash
  npm install-all (installs both client and server dependencies)
  npm run install-server
  npm run install-client
```

## API

The server exposes an API endpoint to fetch logs with pagination:

- **GET** `/api/logs/pagination?page={page}&limit={limit}`

This endpoint returns logs in a stream format, allowing for efficient data handling.
