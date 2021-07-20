import { Command } from '@base/commander';
import { createProject } from '@components/project';

new Command()
  .description('Create a project')
  .argument('[project-name]', 'Project name')
  .action((projectName: string) => {
    createProject(projectName);
  })
  .parseAsync();
