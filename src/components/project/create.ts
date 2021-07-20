import { unilog } from '@gloxy/unilog';
import chalk from 'chalk';
import { prompt } from 'inquirer';
import * as project from '@core/project';
import { WillOpenProject } from '@types';
import { openProject } from './open';
import { promptOpenProject } from './prompts';
import { questionProjectTypeSetting, questionProjectName } from './questions';
import { validateProjectName } from './validation';

async function promptInit(projectName?: string): Promise<any> {
  try {
    const answers = await prompt([
      {
        ...questionProjectName,
        when: () => {
          if (projectName) {
            const result = validateProjectName(projectName);
            if (result === true) {
              return false;
            }
            unilog.warn(result);
          }
          return true;
        },
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

async function createProject({
  projectName,
  yes,
}: {
  projectName?: string;
  yes?: boolean;
}): Promise<void> {
  unilog('Create Project');
  try {
    let initSetting;
    if (yes) {
      let prjName;
      if (projectName) {
        const result = validateProjectName(projectName);
        if (result === true) {
          prjName = projectName;
        } else {
          unilog.warn(result);
        }
      }

      prjName = prjName || (await prompt([questionProjectName])).name;

      initSetting = {
        name: prjName,
      };
    } else {
      initSetting = await promptInit(projectName);
    }

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
