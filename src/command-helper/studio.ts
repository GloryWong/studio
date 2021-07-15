/* eslint-disable @typescript-eslint/no-use-before-define */
import { unilog } from '@gloxy/unilog';
import chalk from 'chalk';
import { prompt } from 'inquirer';
import boxen from 'boxen';
import cfonts from 'cfonts';
import os from 'os';
import path from 'path';
import conf from '../lib/conf';
import { archive } from '../core/studio-archive';
import * as utility from '../lib/utility';
import { getInfo, setInfo } from '../core/studio-info';
import { cliVersion } from '../cli-helper/cli-info';
import { init, hasInited } from '../core/studio-init';

async function archiveStudio(): Promise<void> {
  unilog('Archive Studio');
  try {
    if (conf.get('locked')) {
      unilog.warn(
        `Studio is ${chalk.yellow.bold('locked')} and cannot be archived.`
      );
      return;
    }

    const name = conf.get('name');
    const answers = await prompt([
      {
        type: 'confirm',
        name: 'willArchive',
        message: `Are you sure you want to archive Studio ${chalk.bold.yellow(
          name
        )}?`,
        default: false,
      },
      {
        type: 'input',
        name: 'name',
        message: `Please confirm the Studio name:`,
        validate: (input) => {
          if (input !== name) {
            return 'Studio name not matched.';
          }

          return true;
        },
        when: ({ willArchive }) => willArchive,
      },
      {
        type: 'input',
        name: 'archiveName',
        message: `Name the archive:`,
        default: name,
        filter: (input: string) => input.trim(),
        validate: (input) => {
          if (!utility.isValidFileName(input)) {
            return 'Invalid file name';
          }

          return true;
        },
        when: ({ willArchive }) => willArchive,
      },
    ]);

    if (answers.willArchive) {
      await archive(answers.archiveName);
      unilog.succeed(`Studio ${chalk.bold.yellow(name)} archived`);
    }
  } catch (error) {
    unilog.fail(error);
  }
}

function infoStudio(): void {
  try {
    const { location, name, description, prjCount, locked } = getInfo();
    const bigTitle = cfonts.render('GLOXY', {
      font: 'block',
      colors: ['system'], // define all colors
      background: 'transparent', // define the background color, you can also use `backgroundColor` here as key
      letterSpacing: 1, // define letter spacing
      lineHeight: 1, // define the line height
      space: true,
      gradient: ['red', 'blue'],
      env: 'node',
    });

    const info = `${bigTitle.string}
      ${chalk.bold.green('GLOXY STUDIO CLI')} ${chalk.bold.yellow(cliVersion)}${
      process.env.NODE_ENV === 'test' ? ` ${chalk.bgMagenta(' test ')}` : ''
    }
      ${chalk.white('Author: Wang Zhaohui (https://zhaozhao.today)')}

      Present Studio:
        Name: ${chalk.bold(name)}
        Location: ${location}
        Description: ${description}
        Prj count: ${prjCount}
        Locked: ${locked}
    `;
    // eslint-disable-next-line no-console
    console.log(boxen(info, { padding: 1, borderStyle: 'double' }));
  } catch (error) {
    unilog.fail('Output Studio info failed', error);
  }
}

function lockStudio(lock: boolean): void {
  unilog('Lock Studio');
  try {
    setInfo('locked', lock);
    unilog.succeed(`Studio ${lock ? '' : 'un'}locked`);
  } catch (error) {
    unilog.fail(error);
  }
}

const DEFAULT_INIT_SETTING: InitSetting = {
  location: process.cwd(),
  name: process.env.STUDIO_DEFAULT_NAME || 'shit',
  description: 'My Studio',
  locked: true,
};

async function initStudio(yes: boolean): Promise<void> {
  unilog('Init Studio');
  if (hasInited()) {
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
      await init(initSetting);
      unilog.info(`Studio ${chalk.bold.yellow(initSetting.name)} initialized`);
    }
  } catch (error) {
    unilog.fail(error);
  }
}

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

export { archiveStudio, infoStudio, lockStudio, initStudio };
