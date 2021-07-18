import { uid } from 'uid/secure';
import mkdirp from 'mkdirp';
import path from 'path';
import Listr from 'listr';
import execa from 'execa';
import storage from '../../lib/storage';
import * as projectIndex from '../../storage/project-index';
import PATH from '../../lib/path';
import * as utility from '../../lib/utility';

// project name should be unique in a Studio
async function cloneProject(initSetting: any): Promise<string> {
  const id = uid();
  try {
    const { name, url, installPkg } = initSetting;
    if (projectIndex.existsByName(name)) {
      throw new Error(`same name project '${name}' already exists`);
    }

    const tasks = new Listr([
      {
        title: 'Write storage',
        task: () => {
          const project = {
            id,
            name,
          };

          storage.add(id, project);
        },
      },
      {
        title: 'Write project index',
        task: () => {
          projectIndex.add(id, {
            name,
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
        title: 'Clone project',
        task: (ctx) =>
          execa('git', ['clone', url, '.'], {
            cwd: ctx.projectPath,
          }).then(({ failed }) => {
            if (failed) {
              throw new Error('Clone project failed');
            }
          }),
      },
      {
        title: `Install packages`,
        task: async (ctx, task) => {
          const result = await utility.installPkgDeps(ctx.projectPath);
          if (result === Utility.InstallPkgDepsStatus.NO_DEPS_INFO) {
            task.skip('No dependencies info found, skip.');
          }

          if (result === Utility.InstallPkgDepsStatus.INSTALL_FAILED) {
            task.skip(
              'Install failed. You may need to install dependencies manually.'
            );
          }
        },
        skip: () => !installPkg,
      },
    ]);

    await tasks.run();
    return id;
  } catch (error) {
    throw new Error(`createProject failed: ${error}`);
  }
}

export { cloneProject };
