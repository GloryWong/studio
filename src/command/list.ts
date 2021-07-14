import { Command } from 'commander';
import { initCLIOrWarning } from '../command-helper/init';
import { displayList } from '../command-helper/prj-list';

new Command()
  .action(() => {
    if (!initCLIOrWarning()) {
      return;
    }

    displayList();
  })
  .parse();
