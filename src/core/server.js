const express = require('express');
const app = express();
const loadModules = require('../config/load_modules');

app.use(express.json());

// Auto-load all routes
loadModules(app);

// Start the server
app.listen(3000, () => {
  console.log('🚀 Server is running on http://localhost:3000');
});
