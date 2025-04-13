const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

module.exports = function (args) {
  const [modelName, option, moduleName] = args;

  if (!modelName || !moduleName) {
    console.error("❌ Usage: nexus make-model <ModelName> -m <module>");
    return;
  }

  const modulePath = path.resolve(process.cwd(), `./src/modules/${moduleName}`);
  const modelPath = path.join(modulePath, 'models');
  const migrationPath = path.join(modulePath, 'migrations');

  // Helper to ensure directory exists
  const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  };

  // Create necessary directories
  ensureDir(modelPath);
  if (option === '-m') ensureDir(migrationPath);

  // Build Sequelize command
  let sequelizeCmd = `npx sequelize-cli model:generate --name ${modelName} --attributes name:string --models-path "${modelPath}"`;
  if (option === '-m') {
    sequelizeCmd += ` --migrations-path "${migrationPath}"`;
  }

  exec(sequelizeCmd, (err, stdout, stderr) => {
    if (err) {
      console.error(`❌ Error generating model: ${stderr || err.message}`);
      return;
    }
    console.log(`✅ Model${option === '-m' ? ' and migration' : ''} created successfully:\n${stdout}`);
  });
};
