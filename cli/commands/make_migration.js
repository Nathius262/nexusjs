const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

module.exports = function (args) {
  const [migrationName, moduleName] = args;

  if (!migrationName || !moduleName) {
    console.error("❌ Usage: nexus make-migration <migration-name> <module>");
    return;
  }

  const migrationPath = path.resolve(__dirname, `../../src/modules/${moduleName}/migrations`);

  // Ensure migrations folder exists
  if (!fs.existsSync(migrationPath)) {
    fs.mkdirSync(migrationPath, { recursive: true });
  }

  const command = `npx sequelize-cli migration:generate --name ${migrationName} --migrations-path "${migrationPath}"`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(`❌ Migration creation failed: ${stderr || err.message}`);
      return;
    }
    console.log(`✅ Migration "${migrationName}" created successfully:\n${stdout}`);
  });
};
