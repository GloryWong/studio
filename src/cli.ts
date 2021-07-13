import './env';
import { Command } from 'commander';
import _ from 'lodash';
import { unilog } from '@gloxy/unilog';
import { initCLIOrWarning } from './command-helper/init';
import { listAllPrjs, searchAndChoosePrj } from './option/prj-list';
import { createPrj } from './option/prj';
import {
  cliVersion,
  cliDescription,
  cliUsage,
} from './command-helper/cli-info';
import {
  lockStudio,
  initStudio,
  archiveStudio,
  infoStudio,
} from './option/studio';

const program = new Command();
program
  .version(cliVersion)
  .description(cliDescription)
  .usage(cliUsage)
  .arguments('[prjSelector]')
  // .command('proj', 'Project', {
  //   executableFile: path.join(__dirname, 'command/proj'),
  // })
  .option('--init [studio path]', 'init studio')
  .option('--info', 'output studio information')
  .option('--archive', 'archive studio')
  .option('-l, --list', 'list all prjs')
  .option('-c, --create <name>', 'create a prj')
  .option('--tag <tags...>', 'use tags')
  .option('--lock', 'lock studio')
  .option('--no-lock', 'unlock studio')
  .action(async function action(prjSelector: string, options) {
    try {
      // output help by default
      if (!prjSelector && _.isEmpty(options)) {
        program.help();
        return;
      }

      // check init
      if (!options.init && !initCLIOrWarning()) {
        return;
      }

      // instant searching projects
      if (prjSelector) {
        await searchAndChoosePrj(prjSelector);
        return;
      }

      /**
       * Options manipulation
       */

      const { init, info, list, create, lock, archive } = options;

      if (init) {
        await initStudio(typeof init === 'boolean' ? undefined : init);
        return;
      }

      if (info) {
        infoStudio();
        return;
      }

      if (list) {
        listAllPrjs();
        return;
      }

      if (create) {
        createPrj(create);
        return;
      }

      if (lock !== undefined) {
        lockStudio(lock);
        return;
      }

      if (archive) {
        archiveStudio();
        return;
      }
    } catch (error) {
      unilog('Prj CLI').fail(error);
    }
  })
  .parse();
