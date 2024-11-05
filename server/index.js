const express = require('express');
const cors = require('cors');
const logRoutes = require('./routes/logRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/logs', logRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`);
});
