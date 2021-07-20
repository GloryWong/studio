import './env';
import path from 'path';
import { unilog } from '@gloxy/unilog';
import { Command } from './base/commander';
import { chooseProject } from './components/project';
import {
  cliVersion,
  cliDescription,
  // cliUsage,
} from './utils/info';

new Command({ helpByDefault: true })
  .version(cliVersion)
  .description(cliDescription)
  // .usage(cliUsage)
  .argument('[project-name]', 'choose a project')
  .command('init', 'init studio', {
    executableFile: path.join(__dirname, 'commands/init.js'),
  })
  .command('archive', 'archive studio or a project', {
    executableFile: path.join(__dirname, 'commands/archive.js'),
  })
  .command('search', 'search project', {
    executableFile: path.join(__dirname, 'commands/search.js'),
  })
  .command('info', 'get or set information of studio or a project', {
    executableFile: path.join(__dirname, 'commands/info.js'),
  })
  .command('lock', 'lock or unlock studio', {
    executableFile: path.join(__dirname, 'commands/lock.js'),
  })
  .command('list', 'list projects in the studio', {
    executableFile: path.join(__dirname, 'commands/list.js'),
  })
  .command('create', 'create a project', {
    executableFile: path.join(__dirname, 'commands/create.js'),
  })
  .command('clone', 'clone a project from git repository', {
    executableFile: path.join(__dirname, 'commands/clone.js'),
  })
  .action(async function action(projectName: string) {
    try {
      // instant searching projects
      if (projectName) {
        chooseProject(projectName);
        return;
      }
    } catch (error) {
      unilog('Project CLI').fail(error);
    }
  })
  .parse();
