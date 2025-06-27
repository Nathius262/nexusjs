const path = require('path');
const fs = require('fs');
const minimist = require('minimist');
const {
  generateAdminCreateView, generateAdminListView,
  generateAdminUpdateView, generatePublicListView,
  generatePublicSingleView

} = require('../utils/viewgen_helper.cjs');


const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

module.exports = function createViews(argv) {
  const args = minimist(argv);
  const moduleName = args._[0];
  const isAdmin = args.admin;

  if (!moduleName) {
    console.error("❌ Module name is required. Usage: nexus make-views <moduleName> [--admin]");
    return;
  }

  const modelName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
  const viewsBasePath = path.join(process.cwd(), `./src/modules/${moduleName}/views`);
  
  // Create admin views if --admin flag is set
  if (isAdmin) {
    const adminViewsPath = path.join(viewsBasePath, 'admins');
    ensureDir(adminViewsPath);

    // Admin Create View
    const createViewPath = path.join(adminViewsPath, `${moduleName}_create.html`);
    if (!fs.existsSync(createViewPath)) {
      fs.writeFileSync(createViewPath, generateAdminCreateView(moduleName, modelName));
      console.log(`✅ Admin create view created at ${createViewPath}`);
    }

    // Admin Update View
    const updateViewPath = path.join(adminViewsPath, `${moduleName}_update.html`);
    if (!fs.existsSync(updateViewPath)) {
      fs.writeFileSync(updateViewPath, generateAdminUpdateView(moduleName, modelName));
      console.log(`✅ Admin update view created at ${updateViewPath}`);
    }

    // Admin List View
    const listViewPath = path.join(adminViewsPath, `${moduleName}_list.html`);
    if (!fs.existsSync(listViewPath)) {
      fs.writeFileSync(listViewPath, generateAdminListView(moduleName, modelName));
      console.log(`✅ Admin list view created at ${listViewPath}`);
    }
  }

  else{
    // Create public views
    const publicViewsPath = viewsBasePath;
    ensureDir(publicViewsPath);

    // Public List View
    const publicListViewPath = path.join(publicViewsPath, `${moduleName}_list.html`);
    if (!fs.existsSync(publicListViewPath)) {
      fs.writeFileSync(publicListViewPath, generatePublicListView(moduleName, modelName));
      console.log(`✅ Public list view created at ${publicListViewPath}`);
    }

    // Public Single View
    const publicSingleViewPath = path.join(publicViewsPath, `${moduleName}_single.html`);
    if (!fs.existsSync(publicSingleViewPath)) {
      fs.writeFileSync(publicSingleViewPath, generatePublicSingleView(moduleName, modelName));
      console.log(`✅ Public single view created at ${publicSingleViewPath}`);
    }
  }
};

