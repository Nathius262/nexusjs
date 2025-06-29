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

  // Shared for both admin and public
  methods.push(
    exportFunction('findAll', `async (req, res) => {
  const {page, limit, offset} = req.pagination
  try {
    const data = await service.findAll({limit, offset});
    res.status(200).render('${isAdmin ? `./admins/${moduleName}_list` : `./${moduleName}_list`}', {
      success: true,
      pageTitle: "${isAdmin ? 'Admin' : ''}",
      ${moduleName}s: data.${moduleName}s,
      totalItems: data.totalItems,
      totalPages: data.totalPages,
      currentPage: page
    });
  } catch (err) {
  console.log(err)
    res.status(500).render('errors/500', { error: err });
  }
}`),

    exportFunction('findById', `async (req, res) => {
  try {
    const data = await service.findById(req.params.id);
    res.status(200).render('${isAdmin ? `./admins/${moduleName}_update` : `./${moduleName}_single`}', {
      success: true,
      pageTitle: "${isAdmin ? 'Update Record' : 'Details'}",
      ${moduleName}: data,
    });
  } catch (err) {
  console.log(err)
    res.status(404).render('errors/404', { error: err });
  }
}`)
  );

  if (isAdmin) {
    // Only for admin
    methods.push(
      exportFunction('create', `async (req, res) => {
  try {
    const data = await service.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err });
  }
}`),

      exportFunction('update', `async (req, res) => {
  try {
    const data = await service.update(req.params.id, req.body);
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err });
  }
}`),

      exportFunction('destroy', `async (req, res) => {
  try {
    const data = await service.destroy(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted successfully', data });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err });
  }
}`),

      exportFunction('renderCreate', `async (req, res) => {
  try {
    res.status(200).render('./admins/${moduleName}_create', {
      pageTitle: "Create ${modelName}"
    });
  } catch (err) {
    console.log(err)
    res.status(500).render('errors/500', { error: err });
  }
}`),
    );
  }

  const template = `${importLine}\n\n${methods.join('\n\n')}\n`;

  ensureDir(controllerPath);
  fs.writeFileSync(fullControllerPath, template.trim());
  console.log(`✅ Controller created at ${fullControllerPath}`);
};
