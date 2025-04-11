const path = require('path');
const fs = require('fs');
const minimist = require('minimist');

// Helper function to create directories if they don't exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

module.exports = function createService(argv) {
  const args = minimist(argv);
  const moduleName = args._[0];
  const isAdmin = args.admin;

  if (!moduleName) {
    console.error("❌ Module name is required. Usage: nexus make-service <moduleName> [--admin]");
    return;
  }

  const modelName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
  const servicePath = path.join(__dirname, `../../src/modules/${moduleName}/services`);
  const serviceFileName = isAdmin ? `admin.${modelName}.service.js` : `${modelName}.service.js`;
  const fullServicePath = path.join(servicePath, serviceFileName);

  // 🛑 Don't overwrite existing file
  if (fs.existsSync(fullServicePath)) {
    console.warn(`⚠️  Service already exists at ${fullServicePath}. Skipping creation.`);
    return;
  }

  const serviceTemplate = isAdmin ? 
  `const { ${modelName} } = require('../models/${moduleName}');

exports.create = async (data) => {
  return await ${modelName}.create(data);
};

exports.findAll = async () => {
  return await ${modelName}.findAll();
};

exports.findById = async (id) => {
  return await ${modelName}.findByPk(id);
};

exports.update = async (id, data) => {
  const item = await ${modelName}.findByPk(id);
  if (!item) throw new Error('Not found');
  return await item.update(data);
};

exports.delete = async (id) => {
  const item = await ${modelName}.findByPk(id);
  if (!item) throw new Error('Not found');
  return await item.destroy();
};

exports.adminMethod = async () => {
  // Example of admin-specific logic
  return 'Admin-specific logic here';
};` : 
  `const { ${modelName} } = require('../models/${moduleName}');


exports.create = async (data) => {
  return await ${modelName}.create(data);
};

exports.findById = async (id) => {
  return await ${modelName}.findByPk(id);
};

exports.update = async (id, data) => {
  const item = await ${modelName}.findByPk(id);
  if (!item) throw new Error('Not found');
  return await item.update(data);
};

exports.delete = async (id) => {
  const item = await ${modelName}.findByPk(id);
  if (!item) throw new Error('Not found');
  return await item.destroy();
};`;

  ensureDir(servicePath);
  fs.writeFileSync(fullServicePath, serviceTemplate);
  console.log(`✅ Service created at ${fullServicePath}`);
};
