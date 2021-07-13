/* eslint-disable @typescript-eslint/no-use-before-define */
import { Command } from 'commander';
import { prompt } from 'inquirer';
import { unilog } from '@gloxy/unilog';
import os from 'os';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { init, hasInited } from '../core/studio-init';

const DEFAULT_INIT_SETTING: InitSetting = {
  location: process.cwd(),
  name: process.env.STUDIO_DEFAULT_NAME || 'shit',
  description: 'My Studio',
  locked: true,
};

const program = new Command();
program
  .option(
    '-y, --yes',
    'Automatically answer "yes" to any prompts that the init process might print on the command line.'
  )
  .action(async function action(options) {
    if (hasInited()) {
      unilog.warn('Studio has existed.');
      return;
    }

    if (options.yes) {
      init(DEFAULT_INIT_SETTING);
      return;
    }

    const answers = await prompts();
    if (answers) init(answers);
  })
  .parse();

async function prompts(): Promise<InitSetting | null> {
  try {
    const answers = await prompt([
      {
        type: 'list',
        name: 'location',
        message: 'Where do you want to place your studio?',
        choices: [
          {
            name: 'Current directory',
            value: process.cwd(),
            short: process.cwd(),
          },
          {
            name: 'User Home',
            value: process.env.HOME || os.homedir(),
            short: process.env.HOME || os.homedir(),
          },
          {
            name: 'Customize',
            value: 'customize',
          },
        ],
        default: 0,
      },
      {
        type: 'input',
        name: 'location',
        message: 'Customize the location for your studio:',
        askAnswered: true,
        validate: (input): string | boolean => {
          const p = path.resolve(input);
          return validateLocationAccess(p);
        },
        filter: (input) => {
          return path.resolve(input);
        },
        when: ({ location }) => {
          return location === 'customize';
        },
      },
      {
        type: 'input',
        name: 'name',
        message: 'Name your studio:',
        default: DEFAULT_INIT_SETTING.name,
        validate: (input, { location }) => {
          return validatePathExist(input, location);
        },
      },
      {
        type: 'input',
        name: 'description',
        message: 'Describe your studio',
        default: DEFAULT_INIT_SETTING.description,
      },
      {
        type: 'confirm',
        name: 'locked',
        message: 'Lock your studio?',
        default: DEFAULT_INIT_SETTING.locked,
      },
    ]);

    return answers;
  } catch (error) {
    unilog.mid('Init prompts').fail(error);
    return null;
  }
}

function validatePathExist(name: string, location: string): string | boolean {
  const studioPath = path.join(location, name);
  return fs.existsSync(studioPath)
    ? `Directory ${chalk.yellow.bold(name)} has existed in ${chalk.bold(
        location
      )}, please type another name.`
    : true;
}

function validateLocationAccess(location: string): string | boolean {
  try {
    // eslint-disable-next-line no-bitwise
    fs.accessSync(location, fs.constants.R_OK | fs.constants.W_OK);
  } catch (error) {
    return `No access to ${chalk.yellow.bold(location)}: ${error}`;
  }

  return true;
}
