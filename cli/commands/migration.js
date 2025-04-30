#!/usr/bin/env node

/**
 * Migration Script for Nexus CLI
 * ------------------------------------------
 * 💡 Problem:
 *   - In a modular app structure, migrations live inside `src/modules/** /migrations`.
 *   - The `umzug` library expects glob patterns that resolve correctly.
 *   - On Windows, `path.join()` uses backslashes (`\`), which break globs.
 *
 * ✅ Solution:
 *   - Build the glob manually using `process.cwd()` (current project root) + `/` separators.
 *   - This ensures compatibility across macOS, Linux, Windows (CMD, Git Bash, PowerShell, etc.).
 *
 * 📚 Usage:
 *   $ nexus migrations up
 *   $ nexus migrations down --name 20240101-create-user.js
 *   $ nexus migrations status
 *   $ nexus migrations-debug
 */

const path = require('path');
const { Sequelize } = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');
const glob = require('glob');
const minimist = require('minimist');
const configFilePath = path.resolve(process.cwd(), 'src/core/sequelize.config.js');
const configFile = require(configFilePath);


module.exports = async function (rawArgs) {
  const args = minimist(rawArgs);
  const command = args._[0]; // 'up', 'down', 'status', 'debug'
  const migrationName = args.name; // Optional: --name some_migration.js

  const env = process.env.NODE_ENV || 'development';
  const config = configFile[env];
  const sequelize = new Sequelize(config.database, config.username, config.password, config);

  // ✨ Build a cross-platform migration glob
  const migrationGlob = path.posix.join(
    process.cwd().replace(/\\/g, '/'),
    'src/modules/**/migrations/*.js'
  );

  const umzug = new Umzug({
    migrations: {
      glob: migrationGlob,
      resolve: ({ name, path: filepath, context }) => {
        const migration = require(filepath);
        return {
          name,
          up: async () => migration.up(context, Sequelize),
          down: async () => migration.down(context, Sequelize),
        };
      },
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });

  try {
    await sequelize.authenticate();
    console.log(`\n🔗 Connected to database: ${config.database}\n`);

    if (command === 'debug' || command === 'migrations-debug') {
      console.log(`📂 Scanning for migration files...\n`);
      console.log(`🔍 Using Glob Pattern: ${migrationGlob}\n`);

      const files = glob.sync(migrationGlob);

      if (files.length === 0) {
        console.log('🚫 No migration files found.');
      } else {
        for (const file of files) {
          const exported = require(file);
          console.log(`📄 File: ${file}`);
          console.log(`🔍 Exported methods: ${Object.keys(exported).join(', ')}`);
          console.log('---');
        }
      }
    } else if (command === 'status') {
      const executed = await umzug.executed();
      const pending = await umzug.pending();

      console.log('\n📋 Migration Status:\n');
      console.log('✅ Executed:\n', executed.map(m => `- ${m.name}`).join('\n') || 'None');
      console.log('\n⏳ Pending:\n', pending.map(m => `- ${m.name}`).join('\n') || 'None');
    } else if (command === 'up' || command === 'down') {
      umzug.on('migrating', (name) => console.log({ event: 'migrating', name }));
      umzug.on('migrated', (name) => console.log({ event: 'migrated', name }));

      if (migrationName) {
        const allMigrations = await umzug.migrations();
        const target = allMigrations.find(m => m.name === migrationName);

        if (!target) {
          console.error(`❌ Migration "${migrationName}" not found.`);
          process.exit(1);
        }

        const result = await umzug.execute({
          migrations: [migrationName],
          method: command,
        });

        console.log(`\n${command === 'up' ? '✅ Applied' : '↩️ Reverted'} migration: ${migrationName}`);
      } else {
        const result = await umzug[command]();
        console.log(`\n${command === 'up' ? '✅ Applied' : '↩️ Reverted'} migrations:\n`, result.map(m => `- ${m.name}`).join('\n'));
      }
    } else {
      console.log('❌ Invalid command. Use: up | down | status | debug [--name filename.js]');
    }

    await sequelize.close();
    console.log('\n🔌 Connection closed\n');
  } catch (err) {
    console.error('🚨 Migration error:', err.message);
    process.exit(1);
  }
};
