import { Command } from '../base/commander';
import { cloneProject } from '../components/project';

new Command()
  .description('Clone a project from a git repository')
  .argument('[url]', 'Git repository url')
  .action((url) => {
    cloneProject(url);
  })
  .parseAsync();
