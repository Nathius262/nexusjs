const path = require('path');
const fs = require('fs');
const minimist = require('minimist');

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

module.exports = function createController(argv) {
  const args = minimist(argv);
  const moduleName = args._[1];
  const isAdmin = args.admin;

  if (!moduleName) {
    console.error("❌ Module name is required. Usage: nexus make-controller <moduleName> [--admin]");
    return;
  }

  const modelName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
  const controllerPath = path.join(__dirname, `../../src/modules/${moduleName}/controllers`);
  const controllerFileName = isAdmin ? `admin.${modelName}.controller.js` : `${modelName}.controller.js`;
  const fullControllerPath = path.join(controllerPath, controllerFileName);

  // 🚫 Check if controller already exists
  if (fs.existsSync(fullControllerPath)) {
    console.warn(`⚠️  Controller already exists at ${fullControllerPath}. Skipping creation.`);
    return;
  }

  const serviceImport = isAdmin
    ? `const service = require('../services/admin.${modelName}.service');`
    : `const service = require('../services/${modelName}.service');`;

  const template =
`${serviceImport}

exports.create = async (req, res) => {
  try {
    const data = await service.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

${isAdmin ? `
exports.adminDashboard = async (req, res) => {
  // Example admin controller method
  res.json({ message: "Welcome to admin dashboard" });
};
` : ''}`;

  ensureDir(controllerPath);
  fs.writeFileSync(fullControllerPath, template);
  console.log(`✅ Controller created at ${fullControllerPath}`);
};
