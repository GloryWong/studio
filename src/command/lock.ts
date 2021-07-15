import { Command } from 'commander';
import { initCLIOrWarning } from '../cli-helper/init';
import { lockStudio } from '../command-helper/studio';

const program = new Command();
program
  .option('--studio', 'lock studio')
  .option('--no-studio', 'unlock studio')
  // .option('--project', 'lock a project')
  .action(({ studio }) => {
    if (!initCLIOrWarning()) {
      return;
    }

    if (studio === undefined) {
      program.help();
      return;
    }

    lockStudio(studio);
  })
  .parse();
