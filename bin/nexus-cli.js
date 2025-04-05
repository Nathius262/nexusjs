#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// Get CLI arguments
const args = process.argv.slice(2);
const command = args[0];

// Define available commands
const commands = {
  "make-module": "make_module.js",
  "make-model": "make_model.js",
  "make-migration": "make_migration.js",
  "make-seeder": "make_seeder.js"
};

if (commands[command]) {
  require(path.join(__dirname, '../cli/commands', commands[command]))(args.slice(1));
} else {
  console.log("❌ Invalid command. Try 'nexus make-model' or 'nexus make-module'");
}
