import { Command } from '@base/commander';
import { createProject } from '@components/project';

new Command()
  .description('Create a project')
  .action(() => {
    createProject();
  })
  .parseAsync();
