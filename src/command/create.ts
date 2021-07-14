import { Command } from 'commander';
import { createPrj } from '../command-helper/prj';
import { initCLIOrWarning } from '../command-helper/init';

new Command()
  .description('Search a project with name')
  .action(() => {
    if (!initCLIOrWarning()) {
      return;
    }

    createPrj();
  })
  .parse();
