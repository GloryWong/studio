import './env';
import { Command } from 'commander';
import _ from 'lodash';
import path from 'path';
import { unilog } from '@gloxy/unilog';
import { initCLIOrWarning } from './command-helper/init';
import { listAllPrjs, searchAndChoosePrj } from './option/prj-list';
import { createPrj } from './option/prj';
import { cliVersion, cliDescription, cliUsage } from './command-helper/cliInfo';
import { lockStudio } from './option/studio';

const program = new Command();
program
  .version(cliVersion)
  .description(cliDescription)
  .usage(cliUsage)
  .arguments('[prjSelector]')
  .command('init [path]', 'Init a studio', {
    executableFile: path.join(__dirname, 'command/init.js'),
  })
  .command('archive', 'Archive existing studio', {
    executableFile: path.join(__dirname, 'command/archive.js'),
  })
  .command('info', 'Display studio information', {
    executableFile: path.join(__dirname, 'command/info.js'),
  })
  .option('-l, --list', 'list all prjs')
  .option('-c, --create <name>', 'create a prj')
  .option('--tag <tags...>', 'use tags')
  .option('--lock', 'lock studio')
  .option('--no-lock', 'unlock studio')
  .action(async function action(prjSelector: string, options) {
    try {
      if (!prjSelector && _.isEmpty(options)) {
        program.help();
        return;
      }

      if (!initCLIOrWarning()) {
        return;
      }

      if (prjSelector) {
        await searchAndChoosePrj(prjSelector);
        return;
      }

      const { list, create, lock } = options;

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
