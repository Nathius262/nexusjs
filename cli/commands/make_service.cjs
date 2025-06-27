const path = require('path');
const fs = require('fs');
const minimist = require('minimist');
const { isESModuleProject, getServiceSyntaxHelpers } = require('../utils/codegen_helpers.cjs');

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
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

  const isModule = isESModuleProject();
  const { importStatement, exportFn } = getServiceSyntaxHelpers({ isESM: isModule, modelName, moduleName });

  const adminMethods = isAdmin
    ? [
        exportFn('create', `async (data) => {
  try {
    return await db.${modelName}.create(data);
  } catch (error) {
   console.log(error)
    throw new Error('Error creating record: ' + error.message);
  }
}`),
        exportFn('update', `async (id, data) => {
  try {
    const item = await db.${modelName}.findByPk(id);
    if (!item) throw new Error('Not found');
    return await item.update(data);
  } catch (error) {
   console.log(error)
    throw new Error('Error updating record: ' + error.message);
  }
}`),
        exportFn('destroy', `async (id) => {
  try {
    const item = await db.${modelName}.findByPk(id);
    if (!item) throw new Error('Not found');
    return await item.destroy();
  } catch (error) {
   console.log(error)
    throw new Error('Error deleting record: ' + error.message);
  }
}`),
      ]
    : [];

  const commonMethods = [
    exportFn('findAll', `async ({limit, offset}) => {
  try {
    const {rows: ${moduleName}s, count: totalItems } = await db.${modelName}.findAndCountAll({
      limit,
      offset,
      distinct:true,
      order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']],
    })
    return {
      ${moduleName}s,
      totalItems,
      totalPages: Math.ceil(totalItems / limit)
    };
  } catch (error) {
   console.log(error)
    throw new Error('Error fetching records: ' + error.message);
  }
}`),
    exportFn('findById', `async (id) => {
  try {
    const item = await db.${modelName}.findByPk(id);
    if (!item) throw new Error('Not found');
    return item;
  } catch (error) {
   console.log(error)
    throw new Error('Error fetching record: ' + error.message);
  }
}`),
  ];

  const serviceTemplate = [importStatement, '', ...commonMethods, ...adminMethods].join('\n\n');

  ensureDir(servicePath);
  fs.writeFileSync(fullServicePath, serviceTemplate.trimStart());
  console.log(`✅ Service created at ${fullServicePath}`);
};
