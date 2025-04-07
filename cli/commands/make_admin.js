const makeController = require('./make_controller');
const makeRouter = require('./make_router');
const makeService = require('./make_service');

module.exports = function makeAdmin(argv) {
    const args = require('minimist')(argv);
    const moduleName = args._[0];

    if (!moduleName) {
        console.error("❌ Module name is required. Usage: nexus make-module <moduleName> [--admin]");
        return;
    }

    console.log(`🧠 Creating admin controller...`);
    makeController([moduleName, '--admin']);


    console.log(`🌐 Creating admin router...`);
    makeRouter([moduleName, '--admin']);

    console.log(`⚙️ Creating admin service...`);
    makeService([moduleName, '--admin']);

};
