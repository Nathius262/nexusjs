#!/usr/bin/env node

const path = require('path');

// Import the minimist module for argument parsing
const minimist = require('minimist');

// Get the raw arguments from the command line
const rawArgs = process.argv.slice(2);

// Parse the arguments using minimist
const args = minimist(rawArgs);

// Get the command from the arguments
const command = args._[0];  // The first positional argument will be the command

// Define available commands
const commands = {
  "make-module": "make_module.js",
  "make-model": "make_model.js",
  "make-migration": "make_migration.js",
  "make-seeder": "make_seeder.js",
  "make-service": "make_service.js",
  "make-router": "make_router.js",
  "make-controller": "make_controller.js"
};

if (commands[command]) {
  const commandArgs = rawArgs.slice(1); // Strip off the command itself
  require(path.join(__dirname, '../cli/commands', commands[command]))(commandArgs);
} else {
  console.log("❌ Invalid command. Try 'nexus make-model' or 'nexus make-module'");
}
