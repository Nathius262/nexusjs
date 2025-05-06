const fs = require('fs');
const path = require('path');

// Require from @nathius/nexus package
const { isESModuleProject, loadModule } = require('@nathius/nexus/cli/utils/codegen_helpers');

module.exports = async function loadModules(app) {
  const modulesPath = path.join(process.cwd(), 'src/modules');
  const baseApiPath = '/api';
  const isModule = isESModuleProject();

  const modules = fs.readdirSync(modulesPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const moduleName of modules) {
    const routesDir = path.join(modulesPath, moduleName, 'routes');
    if (!fs.existsSync(routesDir)) continue;

    const routeFiles = fs.readdirSync(routesDir)
      .filter(file => file.endsWith('.routes.js'));

    for (const file of routeFiles) {
      const isAdmin = file.startsWith('admin.');
      const routePath = isAdmin
        ? `${baseApiPath}/admin/${moduleName}`
        : `${baseApiPath}/${moduleName}`;

      const fullPath = path.join(routesDir, file);
      const modulePath = isModule
        ? `file://${fullPath}` // Needed for import()
        : fullPath;

      const routeModule = await loadModule(modulePath, isModule);
      app.use(routePath, routeModule);
      console.log(`✅ Loaded ${isAdmin ? 'admin' : 'public'} route: ${routePath}`);
    }
  }
};
