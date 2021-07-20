import { uid } from 'uid/secure';
import mkdirp from 'mkdirp';
import path from 'path';
import Listr from 'listr';
import execa from 'execa';
// import { projectInstall } from 'pkg-install';
import chalk from 'chalk';
import storage from '@lib/storage';
import * as projectIndex from '@storage/project-index';
import PATH from '@lib/path';
import { Project, ProjectType } from '@types';

// project name should be unique in a Studio
async function createProject(initSetting: any): Promise<string> {
  const id = uid();
  try {
    const { name, initGit, pkgManager, projectType } = initSetting;
    if (projectIndex.existsByName(name)) {
      throw new Error(`same name project '${name}' already exists`);
    }

    const ptype = projectType || ProjectType.DEMO;
    const tasks = new Listr([
      {
        title: 'Write storage',
        task: () => {
          const project: Project = {
            id,
            name,
            type: ptype,
          };

          storage.add(id, project);
        },
      },
      {
        title: 'Write project index',
        task: () => {
          projectIndex.add(id, {
            name,
            type: ptype,
          });
        },
      },
      {
        title: 'Create project dir',
        task: (ctx) => {
          const projectPath = path.join(PATH.ROOT, name);
          mkdirp.sync(projectPath);
          ctx.projectPath = projectPath;
        },
      },
      {
        title: 'Git initialization',
        task: async (ctx) => {
          const result = await execa('git', ['init'], {
            cwd: ctx.projectPath,
          });

          if (result.failed) {
            return Promise.reject(new Error('Failed to initialize git'));
          }

          return Promise.resolve();
        },
        skip: () => !initGit,
      },
      {
        title: `${pkgManager} initialization`,
        task: async (ctx) => {
          // projectInstall({
          //   prefer: pkgManager,
          //   cwd: ctx.projectPath,
          // });
          let result;
          if (pkgManager === 'npm') {
            result = await execa('npm', ['init', '-y'], {
              cwd: ctx.projectPath,
            });
          }

          if (pkgManager === 'yarn') {
            // result = await execa('yarn', ['init'], {
            //   cwd: ctx.projectPath,
            // });
          }

          if (result?.failed) {
            return Promise.reject(
              new Error(
                `Failed to initialize project with ${chalk.yellow.bold(
                  pkgManager
                )}`
              )
            );
          }

          return Promise.resolve();
        },
        skip: () => !pkgManager,
      },
    ]);

    await tasks.run();
    return id;
  } catch (error) {
    throw new Error(`createProject failed: ${error}`);
  }
}

export { createProject };
