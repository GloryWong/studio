import './env';
import { Command } from 'commander';
import path from 'path';
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
import { lockStudio, infoStudio } from './option/studio';

const program = new Command();
program
  .version(cliVersion)
  .description(cliDescription)
  .usage(cliUsage)
  .arguments('[prjSelector]')
  .command('init', 'init studio', {
    executableFile: path.join(__dirname, 'command/studio-init.js'),
  })
  .command('archive', 'archive studio', {
    executableFile: path.join(__dirname, 'command/studio-archive.js'),
  })
  .option('--info', 'output studio information')
  .option('-l, --list', 'list all prjs')
  .option('-c, --create <name>', 'create a prj')
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
      if (!initCLIOrWarning()) {
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

      const { info, list, create, lock } = options;

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
    } catch (error) {
      unilog('Prj CLI').fail(error);
    }
  })
  .parse();
