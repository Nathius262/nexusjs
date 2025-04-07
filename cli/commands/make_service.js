const path = require('path');
const fs = require('fs');
const minimist = require('minimist');

// Helper function to create directories if they don't exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Service creation logic
module.exports = function createService(argv) {
  // Use minimist to parse the arguments
  const args = minimist(argv);  // argv is now correctly passed as an array

  // Debug: log the parsed arguments to ensure correct parsing
  console.log("Parsed arguments:", args);

  const moduleName = args._[1];  // Get the module name from the second positional argument (e.g., 'user')
  const isAdmin = args.admin;    // Check if the --admin flag is passed

  if (!moduleName) {
    console.error("❌ Module name is required. Usage: nexus make-service <moduleName> [--admin]");
    return;
  }

  // Corrected path to the service file
  const servicePath = path.join(__dirname, `../../src/modules/${moduleName}/services`);
  const modelName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
  const serviceFileName = isAdmin ? `admin.${modelName}.service.js` : `${modelName}.service.js`;
  const fullServicePath = path.join(servicePath, serviceFileName);

  // Service template (Admin and regular service will have slightly different logic, e.g., extra methods for admin)
  const serviceTemplate = isAdmin ? 
  `const { ${modelName} } = require('../models');

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
  `const { ${modelName} } = require('../models');

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

  // Ensure the directory exists and write the service file
  ensureDir(servicePath);
  fs.writeFileSync(fullServicePath, serviceTemplate);
  console.log(`✅ Service created at ${fullServicePath}`);
};
