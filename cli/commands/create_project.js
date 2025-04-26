const fs = require('fs-extra');
const path = require('path');
const ora = require('ora');
const chalk = require('chalk');

module.exports = async function (args, command) {
  const spinner = ora('Setting up project...').start();

  try {
    const projectName = command === 'create-project' ? args[0] : '.'; // if init, current dir

    if (!projectName) {
      spinner.fail(chalk.red('Please specify a project name.'));
      console.log(chalk.yellow('👉 Example: nexus create-project my-app'));
      process.exit(1);
    }

    const targetPath = path.resolve(process.cwd(), projectName);
    const templatePath = path.resolve(__dirname, '../../template');

    await fs.copy(templatePath, targetPath);

    spinner.succeed(chalk.green('Project setup complete! 🚀'));
    console.log(chalk.blueBright(`\n👉 cd ${projectName}`));
    console.log(chalk.yellowBright('👉 npm install'));
  } catch (error) {
    spinner.fail(chalk.red('Failed to create project.'));
    console.error(error);
  }
};
