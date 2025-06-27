const makeController = require('./make_controller.cjs');
const makeRouter = require('./make_router.cjs');
const makeService = require('./make_service.cjs');
const makeView = require('./make_view.cjs');

module.exports = function makeAdmin(argv) {
    const args = require('minimist')(argv);
    const moduleName = args._[0];

    if (!moduleName) {
        console.error("❌ Module name is required. Usage: nexus make-module <moduleName> [--admin]");
        return;
    }

    //create admin controllers
    console.log(`🧠 Creating admin controller...`);
    makeController([moduleName, '--admin']);


    //create admin views
    console.log(`🌐 Creating admin views...`);
    makeView([moduleName, '--admin']);


    //create admin routes
    console.log(`🌐 Creating admin router...`);
    makeRouter([moduleName, '--admin']);

    //create admin service
    console.log(`⚙️ Creating admin service...`);
    makeService([moduleName, '--admin']);

};
