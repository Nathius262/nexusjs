#!/usr/bin/env node

const path = require('path');
const minimist = require('minimist');

function checkSequelizeInstalled() {
  try {
    require.resolve('sequelize', { paths: [process.cwd()] });
    return true;
  } catch (err) {
    return false;
  }
}

// Check for required dependency before continuing
if (!checkSequelizeInstalled()) {
  console.error('❌ Sequelize not found in this project. Please run: npm install sequelize');
  process.exit(1);
} else {
  console.log('✅ Sequelize is installed in the current project.');
}


// Parse CLI arguments
const rawArgs = process.argv.slice(2);
const args = minimist(rawArgs);
const command = args._[0]; // First positional arg = command

// Available commands and their script files
const commands = {
  "make-module": "make_module.js",
  "make-model": "make_model.js",
  "make-migration": "make_migration.js",
  "make-seeder": "make_seeder.js",
  "make-service": "make_service.js",
  "make-router": "make_router.js",
  "make-controller": "make_controller.js"
};

// Route to the appropriate command handler
if (commands[command]) {
  const commandArgs = rawArgs.slice(1); // Pass remaining args
  const commandPath = path.join(__dirname, '../cli/commands', commands[command]);

  try {
    require(commandPath)(commandArgs);
  } catch (error) {
    console.error(`❌ Failed to execute command "${command}":`, error.message);
  }
} else {
  console.log("❌ Invalid command.");
  console.log("👉 Try one of the following:");
  Object.keys(commands).forEach(cmd => console.log(`   - nexus ${cmd}`));
}
