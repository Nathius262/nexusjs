import path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';
import minimist from 'minimist';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  // Load package.json
  let packageJson: any;
  try {
    const { createRequire } = await import('module');
    const require = createRequire(import.meta.url);
    packageJson = require('../package.json');
  } catch {
    const module = await import('../package.json', {
      assert: { type: 'json' }
    });
    packageJson = module.default;
  }

  async function checkSequelizeInstalled(): Promise<boolean> {
    try {
      const { createRequire } = await import('module');
      const require = createRequire(import.meta.url);
      require.resolve('sequelize', { paths: [process.cwd()] });
      return true;
    } catch {
      try {
        await import('sequelize');
        return true;
      } catch {
        return false;
      }
    }
  }

  type CommandType = {
    "make-module": string;
    "make-model": string;
    "make-migration": string;
    "make-seeder": string;
    "make-service": string;
    "make-router": string;
    "make-controller": string;
    migrations: string;
    "migrations-debug": string;
    "create-project": string;
    init: string;
  };

  const commands: CommandType = {
    "make-module": "make_module.cjs",
    "make-model": "make_model.cjs",
    "make-migration": "make_migration.cjs",
    "make-seeder": "make_seeder.cjs",
    "make-service": "make_service.cjs",
    "make-router": "make_router.cjs",
    "make-controller": "make_controller.cjs",
    migrations: "migration.cjs",
    "migrations-debug": "migration_debug.cjs",
    "create-project": "create_project.cjs",
    init: "create_project.cjs"
  };

  const rawArgs = process.argv.slice(2);
  const args = minimist(rawArgs);
  const command = args._[0] as keyof CommandType;

  if (args.version || args.v) {
    console.log(`🚀 Nexus CLI version: ${packageJson.version}`);
    process.exit(0);
  }

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

  if (commands[command]) {
    if (!['create-project', 'init'].includes(command)) {
      const hasSequelize = await checkSequelizeInstalled();
      if (!hasSequelize) {
        console.error('❌ Sequelize not found in this project. Please run: npm install sequelize');
        process.exit(1);
      } else {
        console.log('✅ Sequelize is installed in the current project.');
      }
    }

    const commandArgs = rawArgs.slice(1);
    const commandFile = commands[command];
    const commandPath = path.resolve(__dirname, '../cli/commands', commandFile);
    const commandUrl = pathToFileURL(commandPath).href;

    try {
      if (['migrations', 'migrations-debug'].includes(command)) {
        const module = await import(commandUrl);
        module.default(commandArgs, command);
      } else {
        const { createRequire } = await import('module');
        const require = createRequire(import.meta.url);
        const runCommand = require(commandPath);
        runCommand(commandArgs, command);
      }
    } catch (error: any) {
      console.error(`❌ Failed to execute command "${command}":`, error.message || error);
    }
  } else {
    console.log("❌ Invalid command.");
    console.log("👉 Try one of the following:");
    Object.keys(commands).forEach(cmd => console.log(`   - nexus ${cmd}`));
    console.log(`\nUse "nexus --help" to view available commands.`);
  }
}

// ✅ Call the main function to run the CLI
main().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
