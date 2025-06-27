const path = require('path');
const fs = require('fs');
const minimist = require('minimist');

// Import command modules
const makeModel = require('./make_model.cjs');
const makeController = require('./make_controller.cjs');
const makeRouter = require('./make_router.cjs');
const makeService = require('./make_service.cjs');
const makeAdmin = require('./make_admin.cjs');
const makeView = require('./make_view.cjs');
const makeApiController = require('./make_api_controller.cjs');

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

module.exports = function createModule(argv) {
  const args = minimist(argv, {
    boolean: ['m', 'c', 'r', 's', 'v'],
    alias: {
      m: 'model',
      c: 'controller',
      v: 'view',
      r: 'router',
      s: 'service'
    }
  });

  const moduleName = args._[0]; // 'user'
  const isAdmin = args.admin;
  const isApi = args.api;
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
    const controllerArgs = [moduleName];
    if (isAdmin) controllerArgs.push('--admin');
    if (isApi) controllerArgs.push('--api');

    if (isApi) {
      makeApiController(controllerArgs);
    } else {
      makeController(controllerArgs);
    }
  }
  
  if (args.v) {
    console.log(`🌐 Generating View`);
    makeView([moduleName, ...(isAdmin ? ['--admin'] : [])]);
  }

  if (args.r) {
    console.log(`🌐 Generating router`);
    const routerArgs = [moduleName];
    if (isAdmin) routerArgs.push('--admin');
    if (isApi) routerArgs.push('--api');

    makeRouter(routerArgs);
  }

  
  if (args.s) {
    console.log(`⚙️ Generating service`);
    makeService([moduleName, ...(isAdmin ? ['--admin'] : [])]);
  }
  
};
