const path = require('path');
const fs = require('fs');
const minimist = require('minimist');
const { isESModuleProject, getControllerSyntaxHelpers } = require('../utils/codegen_helpers.cjs');


const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

module.exports = function createController(argv) {
  const args = minimist(argv);
  const moduleName = args._[0];
  const isAdmin = args.admin;

  if (!moduleName) {
    console.error("❌ Module name is required. Usage: nexus make-controller <moduleName> [--admin]");
    return;
  }

  const modelName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
  const controllerPath = path.join(process.cwd(), `./src/modules/${moduleName}/controllers`);
  const controllerFileName = isAdmin ? `admin.${modelName}.controller.js` : `${modelName}.controller.js`;
  const fullControllerPath = path.join(controllerPath, controllerFileName);

  if (fs.existsSync(fullControllerPath)) {
    console.warn(`⚠️  Controller already exists at ${fullControllerPath}. Skipping creation.`);
    return;
  }

  const isModule = isESModuleProject();
  const { importService, exportFunction } = getControllerSyntaxHelpers(isModule);
  const importLine = isAdmin
    ? importService(`../services/admin.${modelName}.service`)
    : importService(`../services/${modelName}.service`);

  const methods = [];

  if (isAdmin) {
    methods.push(
      exportFunction('create', `async (req, res) => {
  try {
    const data = await service.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}`),

      exportFunction('findAll', `async (req, res) => {
  try {
    const data = await service.findAll();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}`),

      exportFunction('findById', `async (req, res) => {
  try {
    const data = await service.findById(req.params.id);
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}`),

      exportFunction('update', `async (req, res) => {
  try {
    const data = await service.update(req.params.id, req.body);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}`),

      exportFunction('delete', `async (req, res) => {
  try {
    const data = await service.delete(req.params.id);
    res.status(200).json({ message: 'Deleted successfully', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}`),

      exportFunction('adminDashboard', `async (req, res) => {
  try {
    const data = await service.adminMethod();
    res.status(200).json({ message: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}`)
    );
  } else {
    methods.push(
      exportFunction('findAll', `async (req, res) => {
  try {
    const data = await service.findAll();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}`),

      exportFunction('findById', `async (req, res) => {
  try {
    const data = await service.findById(req.params.id);
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}`)
    );
  }

  const template = `${importLine}\n\n${methods.join('\n\n')}\n`;

  ensureDir(controllerPath);
  fs.writeFileSync(fullControllerPath, template.trim());
  console.log(`✅ Controller created at ${fullControllerPath}`);
};
