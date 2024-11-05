const express = require('express');
const readline = require('readline');
const axios = require('axios');
const { time, timeStamp } = require('console');

const router = express.Router();

const fileLocation =
  'https://s3.amazonaws.com/io.cribl.c021.takehome/cribl.log';

function parseLogLine(line) {
  try {
    const logEntry = JSON.parse(line);
    const timestamp = new Date(logEntry._time).toISOString();
    const message = logEntry.message;
    return { timestamp, message };
  } catch (error) {
    console.error('Error parsing log line:', error);
    return null;
  }
}

const getPaginatedLogs = async (req, res) => {
  const { page = 1, limit = 50 } = req.query;

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

    const logs = [];
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

    res.json({
      data: logs,
      totalCount: lineCount,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error('Error:', error);
    res
      .status(500)
      .json({ error: 'Server Error, unable to fetch resource' });
  }
};

router.get('/pagination', getPaginatedLogs);

module.exports = router;
