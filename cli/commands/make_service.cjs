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
  const servicePath = path.join(process.cwd(), `./src/modules/${moduleName}/services`);
  const serviceFileName = isAdmin ? `admin.${modelName}.service.js` : `${modelName}.service.js`;
  const fullServicePath = path.join(servicePath, serviceFileName);

  if (fs.existsSync(fullServicePath)) {
    console.warn(`⚠️  Service already exists at ${fullServicePath}. Skipping creation.`);
    return;
  }

  const serviceTemplate = isAdmin
    ? `const { ${modelName} } = require('../models/${moduleName}');

exports.create = async (data) => {
  try {
    return await ${modelName}.create(data);
  } catch (error) {
    throw new Error('Error creating record: ' + error.message);
  }
};

exports.findAll = async () => {
  try {
    return await ${modelName}.findAll();
  } catch (error) {
    throw new Error('Error fetching records: ' + error.message);
  }
};

exports.findById = async (id) => {
  try {
    const item = await ${modelName}.findByPk(id);
    if (!item) throw new Error('Not found');
    return item;
  } catch (error) {
    throw new Error('Error fetching record: ' + error.message);
  }
};

exports.update = async (id, data) => {
  try {
    const item = await ${modelName}.findByPk(id);
    if (!item) throw new Error('Not found');
    return await item.update(data);
  } catch (error) {
    throw new Error('Error updating record: ' + error.message);
  }
};

exports.delete = async (id) => {
  try {
    const item = await ${modelName}.findByPk(id);
    if (!item) throw new Error('Not found');
    return await item.destroy();
  } catch (error) {
    throw new Error('Error deleting record: ' + error.message);
  }
};

exports.adminMethod = async () => {
  return 'Admin-specific logic here';
};`
    : `const { ${modelName} } = require('../models/${moduleName}');

exports.findAll = async () => {
  try {
    return await ${modelName}.findAll();
  } catch (error) {
    throw new Error('Error fetching records: ' + error.message);
  }
};

exports.findById = async (id) => {
  try {
    const item = await ${modelName}.findByPk(id);
    if (!item) throw new Error('Not found');
    return item;
  } catch (error) {
    throw new Error('Error fetching record: ' + error.message);
  }
};`;

  ensureDir(servicePath);
  fs.writeFileSync(fullServicePath, serviceTemplate);
  console.log(`✅ Service created at ${fullServicePath}`);
};
