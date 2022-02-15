import { unilog } from '@gloxy/unilog';
import chalk from 'chalk';
import { prompt } from 'inquirer';
import * as project from '@core/project';
import { WillOpenProject } from '@types';
import execa from 'execa';
import ora from 'ora';
import PATH from '@lib/path';
import { openProject } from './open';
import { promptOpenProject } from './prompts';
import { questionProjectName } from './questions';
import { validateProjectName } from './validation';

function parseProjectName(args: string[]) {
  let isFlag = false;
  let projectName = '';
  let i = 0;
  // eslint-disable-next-line no-plusplus
  for (; i < args.length; i++) {
    if (args[i].startsWith('-')) {
      isFlag = true;
    } else if (isFlag) {
      isFlag = false;
    } else {
      projectName = args[i];
      break;
    }
  }

  return {
    projectName,
    index: projectName.length > 0 ? i : -1,
  };
}

function parseArgs(args: string[]) {
  const { projectName, index } = parseProjectName(args);

  return {
    projectName,
    options: args.splice(index, 1),
  };
}

/**
 * UI: Scaffold Project
 * @param scaffolding - Scaffolding tool
 * @param args - Arguments for scaffolding tool
 * @param projectName - Name of the project
 */
export async function scaffoldProject({
  scaffolding,
  args,
  projectName,
}: {
  scaffolding: string;
  args: string[];
  projectName?: string;
}): Promise<void> {
  unilog('Scaffold Project');
  const spinner = ora('Scaffolding');
  try {
    const { projectName: pn, options } = parseArgs(args);

    let prjName = (pn || projectName) as string;
    if (prjName) {
      const result = validateProjectName(prjName);
      if (typeof result === 'string') {
        unilog.warn(result);
        prjName = (await prompt([questionProjectName])).name;
      }
    } else {
      unilog.warn('Please specify project name');
      prjName = (await prompt([questionProjectName])).name;
    }

    spinner.start();
    await execa('npx', [scaffolding, prjName, ...options], {
      cwd: PATH.ROOT,
    });
    spinner.stop();

    const initSetting = {
      name: prjName,
      willCreateDir: false,
      pkgManager: undefined,
    };

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
  } catch (error) {
    spinner.stop();
    unilog.fail(error);
  }
}
