const path = require('path');
const fs = require('fs');
const minimist = require('minimist');

// Import command modules
const makeModel = require('./make_model');
const makeController = require('./make_controller');
const makeRouter = require('./make_router');
const makeService = require('./make_service');
const makeAdmin = require('./make_admin'); // <-- new

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

module.exports = function createModule(argv) {
  const args = minimist(argv, {
    boolean: ['m', 'c', 'r', 's'],
    alias: {
      m: 'model',
      c: 'controller',
      r: 'router',
      s: 'service'
    }
  });

  const moduleName = args._[0]; // 'user'
  const isAdmin = args.admin;
  const modulePath = path.resolve(process.cwd(), `./src/modules/${moduleName}`);

  if (!moduleName) {
    console.error("❌ Module name is required. Usage: nexus make-module <moduleName> [-mcrs] [--admin]");
    return;
  }

  if (fs.existsSync(modulePath) && !isAdmin) {
    console.warn(`⚠️  Module "${moduleName}" already exists. Skipping base module creation.`);
  } else {
    ensureDir(modulePath);
    console.log(`✅ Module created at ${modulePath}`);
  }

  // Handle ADMIN-only generation
  if (isAdmin) {
    console.log(`🔐 Generating admin layer for "${moduleName}"`);
    makeAdmin(argv);
    return;
  }

  // Handle base layer generation
  if (args.m) {
    console.log(`📦 Generating model and migration for "${moduleName}"`);
    makeModel([moduleName.charAt(0).toUpperCase() + moduleName.slice(1), '-m', moduleName]);
  }

  if (args.c) {
    console.log(`🧠 Generating controller`);
    makeController([moduleName, ...(isAdmin ? ['--admin'] : [])]);
  }
  
  if (args.r) {
    console.log(`🌐 Generating router`);
    makeRouter([moduleName, ...(isAdmin ? ['--admin'] : [])]);
  }
  
  if (args.s) {
    console.log(`⚙️ Generating service`);
    makeService([moduleName, ...(isAdmin ? ['--admin'] : [])]);
  }
  
};
