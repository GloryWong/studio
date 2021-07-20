import { unilog } from '@gloxy/unilog';
import chalk from 'chalk';
import { prompt } from 'inquirer';
import * as project from '@core/project';
import * as projectIndex from '@storage/project-index';
import { isValidFileName } from '@lib/utility';
import { WillOpenProject } from '@types';
import { openProject } from './open';
import { promptOpenProject } from './prompts';
import { questionProjectTypeSetting } from './questions';

function validateProjectName(input: string): string | boolean {
  if (!isValidFileName(input)) {
    return 'This name is not a valid file name, choose another name.';
  }

  if (projectIndex.existsByName(input)) {
    return `${chalk.bold.yellow(input)} has existed, choose another name.`;
  }

  return true;
}

async function promptInit(projectName?: string): Promise<any> {
  try {
    let needProjectName = true;
    if (projectName) {
      const result = validateProjectName(projectName);
      if (typeof result === 'string') {
        unilog.warn(result);
      } else {
        needProjectName = false;
      }
    }

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

          return validateProjectName(input);
        },
        when: needProjectName,
      },
      questionProjectTypeSetting,
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
      },
      {
        type: 'list',
        name: 'pkgManager',
        message: 'Which package manager do you want to use?',
        when: ({ tools }) => tools.includes('pkgManager'),
        choices: ['npm', 'yarn'],
        default: 0,
      },
    ]);

    return {
      ...answers,
      initGit: answers.tools.includes('git'),
      name: answers.name || projectName,
    };
  } catch (error) {
    unilog.mid('Init prompts').fail(error);
    return null;
  }
}

async function createProject(projectName?: string): Promise<void> {
  unilog('Create Project');
  try {
    const initSetting = await promptInit(projectName);

    if (initSetting) {
      // create project
      const id = await project.createProject(initSetting);
      unilog.succeed(`Project ${chalk.bold.yellow(initSetting.name)} created.`);

      // open project
      const willOpenProject = await promptOpenProject();

      if (willOpenProject !== WillOpenProject.NOT_OPEN) {
        openProject(id, {
          reuseWindow: willOpenProject === WillOpenProject.RESUME_WINDOW,
        });
      }
    }
  } catch (error) {
    unilog.fail(error);
  }
}

export { createProject };
