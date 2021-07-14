import { uid } from 'uid/secure';
import mkdirp from 'mkdirp';
import path from 'path';
import Listr from 'listr';
import execa from 'execa';
// import { projectInstall } from 'pkg-install';
import chalk from 'chalk';
import storage from '../lib/storage';
import * as prjIndex from '../storage/prj-index';
import PATH from '../lib/path';
import * as utility from '../lib/utility';
import conf from '../lib/conf';

// prj name should be unique in a Studio
async function createPrj(initSetting: any): Promise<string> {
  const id = uid();
  try {
    const { name, initGit, initPkg, pkgManager } = initSetting;
    if (prjIndex.existsByName(name)) {
      throw new Error(`same name prj '${name}' already exists`);
    }

    const tasks = new Listr([
      {
        title: 'Write storage',
        task: () => {
          const prj: Prj = {
            id,
            name,
          };

          storage.add(id, prj);
        },
      },
      {
        title: 'Write project index',
        task: () => {
          prjIndex.add(id, {
            name,
          });
        },
      },
      {
        title: 'Create project dir',
        task: (ctx) => {
          const prjPath = path.join(PATH.ROOT, name);
          mkdirp.sync(prjPath);
          ctx.prjPath = prjPath;
        },
      },
      {
        title: 'Initialize project with git',
        task: async (ctx) => {
          const result = await execa('git', ['init'], {
            cwd: ctx.prjPath,
          });

          if (result.failed) {
            return Promise.reject(new Error('Failed to initialize git'));
          }

          return Promise.resolve();
        },
        skip: () => !initGit,
      },
      {
        title: `Initialize project with ${pkgManager}`,
        task: async (ctx) => {
          // projectInstall({
          //   prefer: pkgManager,
          //   cwd: ctx.prjPath,
          // });
          let result;
          if (pkgManager === 'npm') {
            result = await execa('npm', ['init', '-y'], {
              cwd: ctx.prjPath,
            });
          }

          if (pkgManager === 'yarn') {
            // result = await execa('yarn', ['init'], {
            //   cwd: ctx.prjPath,
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
        skip: () => !initPkg,
      },
    ]);

    await tasks.run();
    return id;
  } catch (error) {
    throw new Error(`createPrj failed: ${error}`);
  }
}

function openPrj(id: string, reuseWindow = false): void {
  try {
    const prjListItem = prjIndex.get(id);
    if (!prjListItem) {
      throw new Error(`The prj does not exist`);
    }

    const { name } = prjListItem;
    const prjPath = path.join(PATH.ROOT, name);
    execa.sync('code', [prjPath, reuseWindow ? '-r' : '']);
  } catch (error) {
    throw new Error(`openPrj failed: ${error}`);
  }
}

function archivePrj(id: string): Promise<void> {
  try {
    const prj: Prj = storage.get(id, '');
    const { name: prjName } = prj;

    const tasks = new Listr([
      {
        title: `Remove '${prjName}' from Storage`,
        task: () => {
          storage.remove(id);
        },
      },
      {
        title: `Remove '${prjName}' from Index`,
        task: () => {
          prjIndex.remove(id);
        },
      },
      {
        title: `Move prj folder '${prjName}' to archive`,
        task: () => {
          const studioName = conf.get('name');
          return utility.archive(
            path.join(PATH.ROOT, prjName),
            `${studioName}.${prjName}.${id}`
          );
        },
      },
    ]);

    return tasks.run();
  } catch (error) {
    throw new Error(`archivePrj failed: ${error}`);
  }
}

export { createPrj, openPrj, archivePrj };
