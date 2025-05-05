const path = require('path');
const glob = require('glob');
const minimist = require('minimist');

module.exports = async function (rawArgs) {
  const args = minimist(rawArgs);
  const command = args._[0];

  console.log(`\n📂 Scanning for migration files...\n`);

  const globPattern = path
    .join(process.cwd(), 'src/modules/**/migrations/*.js')
    .replace(/\\/g, '/'); // ✅ Fix for Windows

  console.log('🔍 Using Glob Pattern:', globPattern);

  const migrationPaths = glob.sync(globPattern, { absolute: true });

  if (migrationPaths.length === 0) {
    console.log('🚫 No migration files found.');
    return;
  }

  migrationPaths.forEach(filepath => {
    try {
      const migration = require(filepath);
      console.log(`📄 File: ${filepath}`);
      console.log(`🔍 Exported methods: ${Object.keys(migration).join(', ') || 'None'}`);
      console.log('---');
    } catch (err) {
      console.error(`❌ Failed to load ${filepath}: ${err.message}`);
    }
  });
};
