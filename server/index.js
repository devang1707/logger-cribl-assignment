const express = require('express');
const cors = require('cors');
const logRoutes = require('./routes/logRoutes');

const app = express();
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  })
);
app.use(express.json());

app.use('/api/logs', logRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`);
});
