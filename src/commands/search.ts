import { Command } from '../base/commander';
import { chooseProject } from '../components/project';

new Command()
  .argument('[project-name]')
  .description('Search a project with name')
  .action((projectName) => {
    chooseProject(projectName);
  })
  .parse();
