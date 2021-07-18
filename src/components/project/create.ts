import { unilog } from '@gloxy/unilog';
import chalk from 'chalk';
import { prompt } from 'inquirer';
import * as project from '../../core/project';
import * as projectIndex from '../../storage/project-index';
import { isValidFileName } from '../../lib/utility';
import { openProject } from './open';
import { promptOpenProject } from './prompts';

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

          if (projectIndex.existsByName(input)) {
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

async function createProject(): Promise<void> {
  unilog('Create Project');

  try {
    const initSetting = await promptInit();

    if (initSetting) {
      // create project
      const id = await project.createProject(initSetting);
      unilog.succeed(`Project ${chalk.bold.yellow(initSetting.name)} created.`);

      // open project
      const willOpenProject = await promptOpenProject();

      if (willOpenProject !== Project.WillOpenProject.NOT_OPEN) {
        openProject(id, {
          reuseWindow: willOpenProject,
        });
      }
    }
  } catch (error) {
    unilog.fail(error);
  }
}

export { createProject };
