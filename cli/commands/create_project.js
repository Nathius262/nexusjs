const fs = require('fs-extra');
const path = require('path');

module.exports = async function (args, command) {
  const { default: ora } = await import('ora'); 
  const { default: chalk } = await import('chalk');

  const spinner = ora('Creating project...').start();

  try {
    const projectName = command === 'create-project' ? args[0] : '.'; // Use current directory for 'init'

    if (!projectName) {
      spinner.fail(chalk.red('Please specify a project name.'));
      console.log(chalk.yellow('👉 Example: nexus create-project my-app'));
      process.exit(1);
    }

    const targetPath = path.resolve(process.cwd(), projectName);
    const templatePath = path.resolve(__dirname, '../../templates');

    await fs.copy(templatePath, targetPath);

    spinner.succeed(chalk.green('Project setup complete! 🚀'));
    console.log(chalk.blueBright(`\n👉 cd ${projectName}`));
    console.log(chalk.yellowBright('👉 npm install'));
  } catch (error) {
    spinner.fail(chalk.red('Failed to create project.'));
    console.error(error);
  }
};
