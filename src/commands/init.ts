/* eslint-disable @typescript-eslint/no-use-before-define */
import { Command } from '../base/commander';
import { initStudio } from '../components/studio';

new Command({ needPrepareCommand: false })
  .description('Create and initialize studio')
  .option(
    '-y, --yes',
    'Automatically answer "yes" to any prompts that the init process might print on the command line.'
  )
  .action(async function action({ yes }) {
    initStudio(yes);
  })
  .parseAsync();
