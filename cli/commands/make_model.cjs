const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const execAsync = promisify(exec);
const renameAsync = promisify(fs.rename);

module.exports = async function(args) {
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

  try {
    // Build Sequelize command
    let sequelizeCmd = `npx sequelize-cli model:generate --name ${modelName} --attributes name:string --models-path "${modelPath}"`;
    if (option === '-m') {
      sequelizeCmd += ` --migrations-path "${migrationPath}"`;
    }

    // Run the command
    const { stdout } = await execAsync(sequelizeCmd);
    
    // Rename generated files
    const renameFiles = async (dir, ext) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        if (file.endsWith('.js') && 
            (file.includes(modelName.toLowerCase()) || 
             file.match(/^\d{14}-/))) { // Matches migration timestamps
          const oldPath = path.join(dir, file);
          const newPath = path.join(dir, file.replace('.js', `.${ext}`));
          await renameAsync(oldPath, newPath);
          console.log(`✅ Renamed ${file} to ${path.basename(newPath)}`);
        }
      }
    };

    // Rename model and migration files
    await renameFiles(modelPath, 'cjs');
    if (option === '-m') {
      await renameFiles(migrationPath, 'cjs');
    }

    console.log(`✅ Model${option === '-m' ? ' and migration' : ''} created successfully:\n${stdout}`);
  } catch (err) {
    console.error(`❌ Error: ${err.stderr || err.message}`);
  }
};