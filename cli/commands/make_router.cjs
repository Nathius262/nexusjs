const path = require('path');
const fs = require('fs');
const minimist = require('minimist');
const { isESModuleProject, getRouterSyntaxHelpers } = require('../utils/codegen_helpers.cjs');

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

module.exports = function createRouter(argv) {
  const args = minimist(argv);
  const moduleName = args._[0];
  const isAdmin = args.admin;
  const isApi = args.api;

  if (!moduleName) {
    console.error("❌ Module name is required. Usage: nexus make-router <moduleName> [--admin] [--api]");
    return;
  }

  const modelName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
  const subDir = isApi ? 'api' : '';
  const routerPath = path.join(process.cwd(), `./src/modules/${moduleName}/routes`, subDir);
  const prefix = isApi ? (isAdmin ? 'admin.' : '') : (isAdmin ? 'admin.' : '');
  const suffix = isApi ? '.api.routes.js' : '.routes.js';
  const routerFileName = `${prefix}${modelName}${suffix}`;
  const fullRouterPath = path.join(routerPath, routerFileName);

  if (fs.existsSync(fullRouterPath)) {
    console.warn(`⚠️  Router already exists at ${fullRouterPath}. Skipping creation.`);
    return;
  }

  const isModule = isESModuleProject();
  const { importExpress, importUseModuleViews, importWithPagination, importController, routerExport } = getRouterSyntaxHelpers(isModule);

  const controllerPath = isApi
    ? `../controllers/api/${prefix}${modelName}.controller`
    : `../controllers/${prefix}${modelName}.controller`;

  const apiRoutes = `
${importExpress}
${importUseModuleViews}
${importWithPagination}
${importController(controllerPath)}

const router = express.Router();

router.use(useModuleViews('${moduleName}'));

// API routes
router.route('/')
  .get(withPagination(10), controller.findAll)
  .post(controller.create);

router.route('/:id')
  .get(controller.findById)
  .put(controller.update)
  .delete(controller.destroy);

${routerExport('router')}
`;

  const adminRoutes = `
${importExpress}
${importUseModuleViews}
${importWithPagination}
${importController(controllerPath)}

const router = express.Router();

router.use(useModuleViews('${moduleName}'));

// Admin view routes
router.route('/')
  .get(withPagination(10), controller.findAll)
  .post(controller.create);

router.get('/create', controller.renderCreate);

router.route('/:id')
  .get(controller.findById)
  .put(controller.update)
  .delete(controller.destroy);

${routerExport('router')}
`;

  const publicRoutes = `
${importExpress}
${importUseModuleViews}
${importWithPagination}
${importController(controllerPath)}

const router = express.Router();

router.use(useModuleViews('${moduleName}'));

// Public view routes
router.get('/', withPagination(10), controller.findAll);
router.get('/:id', controller.findById);

${routerExport('router')}
`;

  const template = isApi ? apiRoutes : (isAdmin ? adminRoutes : publicRoutes);

  ensureDir(routerPath);
  fs.writeFileSync(fullRouterPath, template.trimStart());
  console.log(`✅ Router created at ${fullRouterPath}`);
};
