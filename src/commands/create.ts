import { Command } from '@base/commander';
import { createProject } from '@components/project';

new Command()
  .description('Create a project')
  .argument('[project-name]', 'Project name')
  .option(
    '-y, --yes',
    'Automatically answer "yes" to any prompts that the create process might print on the command line.'
  )
  .action((projectName: string, { yes }) => {
    createProject({
      projectName,
      yes,
    });
  })
  .parseAsync();
