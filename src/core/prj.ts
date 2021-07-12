import { uid } from 'uid/secure';
import mkdirp from 'mkdirp';
import path from 'path';
import Listr from 'listr';
import storage from '../lib/storage';
import * as index from '../storage/index';
import PATH from '../lib/path';
import { archive } from '../command-helper/archive';

// prj name should be unique in a Studio
function createPrj(name: string): string {
  const id = uid();
  try {
    if (index.existsByName(name)) {
      throw new Error(`same name prj '${name}' already exists`);
    }

    const prj: Prj = {
      id,
      name,
    };

    storage.add(id, prj);
    index.add(id, {
      name,
    });

    // create prj dir
    mkdirp.sync(path.join(PATH.ROOT, name));

    return id;
  } catch (error) {
    throw new Error(`createPrj failed: ${error}`);
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
          index.remove(id);
        },
      },
      {
        title: `Move prj folder '${prjName}' to archive`,
        task: () => {
          const { name: studioName } = path.parse(PATH.ROOT);
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

export { createPrj, archivePrj };
