const path = require('path');
const fs = require('fs');
const minimist = require('minimist');

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

module.exports = function createRouter(argv) {
  const args = minimist(argv);
  const moduleName = args._[0];
  const isAdmin = args.admin;

  if (!moduleName) {
    console.error("❌ Module name is required. Usage: nexus make-router <moduleName> [--admin]");
    return;
  }

  const modelName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
  const routerPath = path.join(process.cwd(), `./src/modules/${moduleName}/routes`);
  const routerFileName = isAdmin ? `admin.${modelName}.routes.js` : `${modelName}.routes.js`;
  const fullRouterPath = path.join(routerPath, routerFileName);

  if (fs.existsSync(fullRouterPath)) {
    console.warn(`⚠️  Router already exists at ${fullRouterPath}. Skipping creation.`);
    return;
  }

  const controllerImport = isAdmin
    ? `const controller = require('../controllers/admin.${modelName}.controller');`
    : `const controller = require('../controllers/${modelName}.controller');`;

  const adminRoutes = `
    ${controllerImport}
    const express = require('express');
    const router = express.Router();

    // Admin routes
    router.post('/', controller.create);
    router.get('/', controller.findAll);
    router.get('/:id', controller.findById);
    router.put('/:id', controller.update);
    router.delete('/:id', controller.delete);
    router.get('/dashboard', controller.adminDashboard);

    module.exports = router;
  `;

  const normalRoutes = `
  ${controllerImport}
  const express = require('express');
  const router = express.Router();

  // Public routes
  router.get('/', controller.findAll);
  router.get('/:id', controller.findById);

  module.exports = router;
`;

  const template = isAdmin ? adminRoutes : normalRoutes;

  ensureDir(routerPath);
  fs.writeFileSync(fullRouterPath, template.trim());
  console.log(`✅ Router created at ${fullRouterPath}`);
};
