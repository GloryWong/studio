import { unilog } from '@gloxy/unilog';
import chalk from 'chalk';
import { prompt } from 'inquirer';
import os from 'os';
import path from 'path';
import * as utility from '../../lib/utility';
import * as studio from '../../core/studio';
import { hasStudioInited } from '../../utils/init';

const DEFAULT_INIT_SETTING: InitSetting = {
  location: process.cwd(),
  name: process.env.STUDIO_DEFAULT_NAME || 'shit',
  description: 'My Studio',
  locked: true,
};

async function promptInit(): Promise<InitSetting | null> {
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
          return utility.validateLocationAccess(p);
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
          return utility.validatePathExist(input, location);
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

async function initStudio(yes: boolean): Promise<void> {
  unilog('Init Studio');
  if (hasStudioInited()) {
    unilog.warn('Studio has existed.');
    return;
  }

  try {
    let initSetting;
    if (yes) {
      unilog.info('init Studio with default settings');
      initSetting = DEFAULT_INIT_SETTING;
    } else {
      initSetting = await promptInit();
    }

    if (initSetting) {
      await studio.initStudio(initSetting);
      unilog.info(`Studio ${chalk.bold.yellow(initSetting.name)} initialized`);
    }
  } catch (error) {
    unilog.fail(error);
  }
}

export { initStudio };
