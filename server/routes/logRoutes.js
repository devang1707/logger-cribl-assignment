const express = require('express');
const readline = require('readline');
const axios = require('axios');

const router = express.Router();

const fileLocation =
  'https://s3.amazonaws.com/io.cribl.c021.takehome/cribl.log';

const getPaginatedLogs = async (req, res) => {
  const { page = 1, limit = 50 } = req.query;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const response = await axios({
      method: 'get',
      url: fileLocation,
      responseType: 'stream',
    });

    const rowStream = readline.createInterface({
      input: response.data,
      crlfDelay: Infinity,
    });

    let logs = [];
    let lineCount = 0;

    for await (const entry of rowStream) {
      lineCount++;
      if (lineCount > (page - 1) * limit && logs.length < limit) {
        const parsedLog = parseLogLine(entry);
        if (parsedLog) {
          logs.push(parsedLog);
        }
      }
    }

    res.write(
      `data: ${JSON.stringify({ logs, totalCount: lineCount })}\n\n`
    );
    res.end();
  } catch (error) {
    console.error('Error:', error);
    res.write(
      `data: ${JSON.stringify({ error: 'Server Error' })}\n\n`
    );
    res.end();
  }
};

router.get('/pagination', getPaginatedLogs);
module.exports = router;
function parseLogLine(line) {
  try {
    const logEntry = JSON.parse(line);
    const timestamp = new Date(logEntry._time).toISOString();
    return { timestamp, ...logEntry };
  } catch (error) {
    console.error('Error parsing log line:', error);
    return null;
  }
}
