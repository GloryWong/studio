/* eslint-disable @typescript-eslint/no-use-before-define */
import { Command } from 'commander';
import { initStudio } from '../command-helper/studio';

const program = new Command();
program
  .description('Create and initialize studio')
  .option(
    '-y, --yes',
    'Automatically answer "yes" to any prompts that the init process might print on the command line.'
  )
  .action(async function action({ yes }) {
    initStudio(yes);
  })
  .parse();
