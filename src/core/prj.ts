import { uid } from 'uid/secure';
import mkdirp from 'mkdirp';
import path from 'path';
import Listr from 'listr';
import execa from 'execa';
import storage from '../lib/storage';
import * as prjIndex from '../storage/prj-index';
import PATH from '../lib/path';
import { archive } from '../command-helper/archive';
import conf from '../lib/conf';

// prj name should be unique in a Studio
function createPrj(name: string): string {
  const id = uid();
  try {
    if (prjIndex.existsByName(name)) {
      throw new Error(`same name prj '${name}' already exists`);
    }

    const prj: Prj = {
      id,
      name,
    };

    storage.add(id, prj);
    prjIndex.add(id, {
      name,
    });

    // create prj dir
    mkdirp.sync(path.join(PATH.ROOT, name));

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
          return archive(
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
