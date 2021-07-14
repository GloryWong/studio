import { Command } from 'commander';
import { initCLIOrWarning } from '../command-helper/init';
import { infoStudio } from '../command-helper/studio';

new Command()
  .action(() => {
    if (!initCLIOrWarning()) {
      return;
    }

    infoStudio();
  })
  .parse();
