const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const execAsync = promisify(exec);
const renameAsync = promisify(fs.rename);

module.exports = async function(args) {
  const [migrationName, moduleName] = args;

  if (!migrationName || !moduleName) {
    console.error("❌ Usage: nexus make-migration <migration-name> <module>");
    return;
  }

  const migrationPath = path.resolve(process.cwd(), `./src/modules/${moduleName}/migrations`);

  // Ensure migrations folder exists
  if (!fs.existsSync(migrationPath)) {
    fs.mkdirSync(migrationPath, { recursive: true });
  }

  try {
    const command = `npx sequelize-cli migration:generate --name ${migrationName} --migrations-path "${migrationPath}"`;
    const { stdout } = await execAsync(command);

    // Rename migration files
    const files = fs.readdirSync(migrationPath);
    for (const file of files) {
      if (file.endsWith('.js') && file.includes(migrationName.toLowerCase())) {
        const oldPath = path.join(migrationPath, file);
        const newPath = path.join(migrationPath, file.replace('.js', '.cjs'));
        await renameAsync(oldPath, newPath);
        console.log(`✅ Renamed ${file} to ${path.basename(newPath)}`);
      }
    }

    console.log(`✅ Migration "${migrationName}" created successfully:\n${stdout}`);
  } catch (err) {
    console.error(`❌ Migration creation failed: ${err.stderr || err.message}`);
  }
};