/* eslint-disable @typescript-eslint/no-use-before-define */
import { unilog } from '@gloxy/unilog';
import chalk from 'chalk';
import { prompt } from 'inquirer';
import * as prj from '../core/prj';
import { search } from './prj-list';
import * as prjIndex from '../storage/prj-index';
import { isValidFileName } from '../lib/utility';

async function openPrj(id: string, options?: any): Promise<void> {
  try {
    let reuseWindow: boolean;
    if (options && Object.keys(options).includes('reuseWindow')) {
      reuseWindow = options.reuseWindow;
    } else {
      const answers = await prompt([
        {
          type: 'confirm',
          name: 'resuseWindow',
          message: 'Open project in new window?',
          default: true,
        },
      ]);
      reuseWindow = answers.reuseWindow;
    }

    prj.openPrj(id, reuseWindow);
    unilog.succeed(
      `project opened ${
        reuseWindow ? 'in last active window' : 'in a new window'
      }`
    );
  } catch (error) {
    unilog.fail('Open project failed:', error);
  }
}

async function archivePrj(projectName: string): Promise<void> {
  unilog('Achive project');
  try {
    const prjItem = await search(projectName);
    if (!prjItem) {
      unilog.fail('project not exists');
      return;
    }

    const { name, id } = prjItem;

    const { question }: { question: boolean } = await prompt({
      type: 'confirm',
      name: 'question',
      message: `Are you sure you want to archive prj '${name}'?`,
      default: false,
    });

    if (question) {
      await prj.archivePrj(id);
      unilog.succeed(`prj '${name}' archived`);
    }
  } catch (error) {
    unilog(error);
  }
}

async function choosePrj(text: string): Promise<void> {
  unilog('Choose a project');
  try {
    const prjItem = await search(text);

    if (prjItem) {
      openPrj(prjItem.id);
    }
  } catch (error) {
    unilog.fail(error);
  }
}

async function createPrj(): Promise<void> {
  unilog('Create Project');

  try {
    const initSetting = await promptInit();

    if (initSetting) {
      // create project
      const id = await prj.createPrj(initSetting);
      unilog.succeed(`Project ${chalk.bold.yellow(initSetting.name)} created.`);

      // open project
      const { willOpenPrj } = await prompt([
        {
          type: 'list',
          name: 'willOpenPrj',
          message: 'Open project?',
          choices: [
            {
              name: 'Not open',
              value: 'notOpen',
            },
            {
              name: 'Open in new window',
              value: false,
            },
            {
              name: 'Open in last active window',
              value: true,
            },
          ],
          default: 0,
        },
      ]);

      if (willOpenPrj !== 'notOpen') {
        openPrj(id, {
          reuseWindow: willOpenPrj,
        });
      }
    }
  } catch (error) {
    unilog.fail(error);
  }
}

async function promptInit(): Promise<any> {
  try {
    const answers = await prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Name your project:',
        filter: (input) => input.trim(),
        validate: (input) => {
          if (input.length === 0) {
            return 'Please input a name for your project.';
          }

          if (!isValidFileName(input)) {
            return 'This name is not a valid file name, choose another name.';
          }

          if (prjIndex.existsByName(input)) {
            return `${chalk.bold.yellow(
              input
            )} has existed, choose another name.`;
          }

          return true;
        },
      },
      {
        type: 'checkbox',
        name: 'tools',
        message: 'Initialize project with tools',
        choices: [
          {
            name: 'Git',
            value: 'git',
          },
          {
            name: 'Node Package Manager',
            value: 'pkgManager',
          },
        ],
        default: ['git', 'pkgManager'],
      },
      {
        type: 'confirm',
        name: 'initGit',
        message: `Initialize project with ${chalk.bold.yellow('git')}?`,
        when: ({ tools }) => tools.includes('git'),
        default: true,
      },
      {
        type: 'list',
        name: 'pkgManager',
        message: 'Which package manager do you want to use?',
        when: ({ tools }) => tools.includes('pkgManager'),
        choices: ['npm', 'yarn'],
        default: 0,
      },
      {
        type: 'confirm',
        name: 'initPkg',
        message: ({ pkgManager }) =>
          `Initialize project with ${chalk.bold.yellow(pkgManager)}`,
        default: true,
      },
    ]);

    return answers;
  } catch (error) {
    unilog.mid('Init prompts').fail(error);
    return null;
  }
}

export { openPrj, createPrj, archivePrj, choosePrj };
