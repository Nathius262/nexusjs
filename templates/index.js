import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import loadModules from './src/config/load_modules.js';
import staticFiles from "./src/config/staticFiles.js";
import configureViewEngine from './src/config/viewEngine.js';
import eventLogger from './src/middlewares/logger.middleware.js';

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Setup Handlebars view engine
configureViewEngine(app);

app.use(eventLogger);

// Middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static files
app.use(staticFiles);

// Load dynamic routes from modules
await loadModules(app);


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
