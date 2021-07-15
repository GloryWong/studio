import { Command } from '../base/commander';
import { createProject } from '../components/project';

new Command()
  .description('Search a project with name')
  .action(() => {
    createProject();
  })
  .parse();
