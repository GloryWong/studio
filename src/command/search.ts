import { Command } from 'commander';
import { choosePrj } from '../command-helper/prj';
import { initCLIOrWarning } from '../cli-helper/init';

new Command()
  .argument('[project-name]')
  .description('Search a project with name')
  .action((projectName) => {
    if (!initCLIOrWarning()) {
      return;
    }

    choosePrj(projectName);
  })
  .parse();
