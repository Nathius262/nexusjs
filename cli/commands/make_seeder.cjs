const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

module.exports = function (args) {
  const [seederName, moduleName] = args;

  if (!seederName || !moduleName) {
    console.error("❌ Usage: nexus make-seeder <seeder-name> <module>");
    return;
  }

  const seederPath = path.resolve(process.cwd(), `./src/modules/${moduleName}/seeders`);

  // Ensure seeders folder exists
  if (!fs.existsSync(seederPath)) {
    fs.mkdirSync(seederPath, { recursive: true });
  }

  const command = `npx sequelize-cli seed:generate --name ${seederName} --seeders-path "${seederPath}"`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(`❌ Seeder creation failed: ${stderr || err.message}`);
      return;
    }
    console.log(`✅ Seeder "${seederName}" created successfully:\n${stdout}`);
  });
};
