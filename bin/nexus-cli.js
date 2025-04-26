#!/usr/bin/env node

const path = require('path');
const minimist = require('minimist');
const packageJson = require('../package.json');

function checkSequelizeInstalled() {
  try {
    require.resolve('sequelize', { paths: [process.cwd()] });
    return true;
  } catch (err) {
    return false;
  }
}

// List of CLI commands and corresponding files
const commands = {
  "make-module": "make_module.js",
  "make-model": "make_model.js",
  "make-migration": "make_migration.js",
  "make-seeder": "make_seeder.js",
  "make-service": "make_service.js",
  "make-router": "make_router.js",
  "make-controller": "make_controller.js",
  "migrations": "migration.js",
  "migrations-debug": "migration_debug.js",
  "create-project": "create_project.js",
  "init": "create_project.js"
};

// Parse CLI arguments
const rawArgs = process.argv.slice(2);
const args = minimist(rawArgs);
const command = args._[0]; // First positional arg = command

// Handle --version
if (args.version || args.v) {
  console.log(`🚀 Nexus CLI version: ${packageJson.version}`);
  process.exit(0);
}

// Handle --help
if (args.help || args.h) {
  console.log(`\n📚 Nexus CLI Help:
Usage: nexus <command> [options]

Available Commands:`);
  Object.keys(commands).forEach(cmd => console.log(`   - nexus ${cmd}`));
  console.log(`\nOptions:
  --version, -v   Show CLI version
  --help, -h      Show CLI help\n`);
  process.exit(0);
}

// Main command execution
if (commands[command]) {
  if (!['create-project', 'init'].includes(command)) {
    if (!checkSequelizeInstalled()) {
      console.error('❌ Sequelize not found in this project. Please run: npm install sequelize');
      process.exit(1);
    } else {
      console.log('✅ Sequelize is installed in the current project.');
    }
  }

  const commandArgs = rawArgs.slice(1);
  const commandPath = path.join(__dirname, '../cli/commands', commands[command]);

  try {
    require(commandPath)(commandArgs, command);
  } catch (error) {
    console.error(`❌ Failed to execute command "${command}":`, error.message);
  }
} else {
  console.log("❌ Invalid command.");
  console.log("👉 Try one of the following:");
  Object.keys(commands).forEach(cmd => console.log(`   - nexus ${cmd}`));
  console.log(`\nUse "nexus --help" to view available commands.`);
}
