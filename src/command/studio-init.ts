/* eslint-disable @typescript-eslint/no-use-before-define */
import { Command } from 'commander';
import { prompt } from 'inquirer';
import { unilog } from '@gloxy/unilog';
import os from 'os';
import { init } from '../core/studio-init';

const program = new Command();
program
  .option(
    '-y, --yes',
    'Automatically answer "yes" to any prompts that the init process might print on the command line.',
    false
  )
  .action(async function action() {
    const answers = await prompts();
    if (answers) init(answers);
  })
  .parse();

async function prompts(): Promise<InitSetting | null> {
  try {
    const answers = await prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Name your studio:',
        default: process.env.STUDIO_DEFAULT_NAME || 'shit',
      },
      {
        type: 'list',
        name: 'location',
        message: 'Where do you want to place your studio?',
        choices: [
          {
            name: 'Current directory',
            value: process.cwd(),
          },
          {
            name: 'User home',
            value: process.env.HOME || os.homedir(),
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
        name: 'customizeLocation',
        message: 'Type the location for your studio',
        when: ({ location }) => {
          return location === 'customize';
        },
      },
      {
        type: 'input',
        name: 'description',
        message: 'Describe your studio',
        default: 'My studio',
      },
      {
        type: 'confirm',
        name: 'locked',
        message: 'Lock your studio?',
        default: true,
      },
    ]);

    return answers;
  } catch (error) {
    unilog.mid('Init prompts').fail(error);
    return null;
  }
}
