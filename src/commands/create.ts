import { Command } from '@base/commander';
import { createProject, scaffoldProject } from '@components/project';

new Command()
  .description('Create a project')
  .argument('[project-name]', 'Project name')
  .option(
    '-y, --yes',
    'Automatically answer "yes" to any prompts that the create process might print on the command line.'
  )
  .option('-s, --scaffolding <scaffolding-tool>', 'Scaffold a web project')
  .action(async (projectName: string, { yes, scaffolding }, command) => {
    if (scaffolding) {
      const dblDashIndex = command.rawArgs.indexOf('--');
      const scaffoldingArgs =
        dblDashIndex > 0 ? command.rawArgs.slice(dblDashIndex + 1) : [];
      await scaffoldProject({
        scaffolding,
        args: scaffoldingArgs,
        projectName,
      });
      return;
    }

    createProject({
      projectName,
      yes,
    });
  })
  .parseAsync();
