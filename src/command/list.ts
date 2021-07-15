import { Command } from 'commander';
import { initCLIOrWarning } from '../cli-helper/init';
import { displayList } from '../command-helper/prj-list';

new Command()
  .action(() => {
    if (!initCLIOrWarning()) {
      return;
    }

    displayList();
  })
  .parse();
