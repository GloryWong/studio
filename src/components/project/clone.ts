import { unilog } from '@gloxy/unilog';
import chalk from 'chalk';
import { prompt } from 'inquirer';
import isUrl from 'is-url';
import * as project from '@core/project';
import * as projectIndex from '@storage/project-index';
import { openProject } from './open';
import { promptOpenProject } from './prompts';

async function promptInit(gitRepoUrl?: string): Promise<any> {
  try {
    const answers = await prompt([
      {
        type: 'input',
        name: 'url',
        message: () => {
          if (gitRepoUrl && !isUrl(gitRepoUrl)) {
            return 'Invalid URL. Reinput url:';
          }
          return 'Input git repository url:';
        },
        filter: (input) => input.trim(),
        validate: (input) => {
          if (input.length === 0) {
            return 'Cannot be empty.';
          }

          if (!isUrl(input)) {
            return 'Not valid URL.';
          }

          return true;
        },
        when: () => !gitRepoUrl || !isUrl(gitRepoUrl),
        default: () => gitRepoUrl || '',
      },
      {
        type: 'input',
        name: 'name',
        message: 'Project name:',
        default: ({ url }: { url: string }) => {
          const u = url || gitRepoUrl || 'project';
          return u.substring(u.lastIndexOf('/') + 1, u.lastIndexOf('.git'));
        },
        validate: (name: string) => {
          if (projectIndex.existsByName(name)) {
            return `Project with name '${name}' already exists. Type another name.`;
          }

          return true;
        },
      },
      {
        type: 'confirm',
        name: 'installPkg',
        message: 'Install packages of the project?',
        default: true,
      },
    ]);

    answers.url = answers.url || gitRepoUrl;

    return answers;
  } catch (error) {
    unilog.mid('Init prompts').fail(error);
    return null;
  }
}

/**
 * @param url - A git repository url which will be cloned
 */
async function cloneProject(url?: string): Promise<void> {
  unilog('Clone Project');

  try {
    const initSetting = await promptInit(url);

    if (initSetting) {
      // clone project
      const id = await project.cloneProject(initSetting);
      unilog.succeed(
        `Cloned project ${chalk.bold.yellow(initSetting.name)} created.`
      );

      // open project
      const willOpenProject = await promptOpenProject();

      if (willOpenProject !== WillOpenProject.NOT_OPEN) {
        openProject(id, {
          reuseWindow: willOpenProject,
        });
      }
    }
  } catch (error) {
    unilog.fail(error);
  }
}

export { cloneProject };
