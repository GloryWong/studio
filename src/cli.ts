import './env';
import { Command } from 'commander';
import path from 'path';
import _ from 'lodash';
import { unilog } from '@gloxy/unilog';
import { initCLIOrWarning } from './command-helper/init';
import { choosePrj } from './command-helper/prj';
import {
  cliVersion,
  cliDescription,
  // cliUsage,
} from './command-helper/cli-info';

const program = new Command();
program
  .version(cliVersion)
  .description(cliDescription)
  // .usage(cliUsage)
  .argument('[project-name]', 'choose a project')
  .command('init', 'init studio', {
    executableFile: path.join(__dirname, 'command/init.js'),
  })
  .command('archive', 'archive studio or a project', {
    executableFile: path.join(__dirname, 'command/archive.js'),
  })
  .command('search', 'search project', {
    executableFile: path.join(__dirname, 'command/search.js'),
  })
  .command('info', 'output studio information', {
    executableFile: path.join(__dirname, 'command/info.js'),
  })
  .command('lock', 'lock or unlock studio', {
    executableFile: path.join(__dirname, 'command/lock.js'),
  })
  .command('list', 'list projects in the studio', {
    executableFile: path.join(__dirname, 'command/list.js'),
  })
  .command('create', 'create a project', {
    executableFile: path.join(__dirname, 'command/create.js'),
  })
  .action(async function action(projectName: string, options) {
    try {
      // output help by default
      if (!projectName && _.isEmpty(options)) {
        program.help();
        return;
      }

      // check init
      if (!initCLIOrWarning()) {
        return;
      }

      // instant searching projects
      if (projectName) {
        choosePrj(projectName);
        return;
      }
    } catch (error) {
      unilog('Prj CLI').fail(error);
    }
  })
  .parse();
