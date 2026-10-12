const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.listen(8100, () => {
    console.log('Server is running on port 8100');
  });
  
