import path from 'path';
import Listr from 'listr';
import mkdirp from 'mkdirp';
import PATH from '@lib/path';
import { hasStudioInited } from '@utils/init';
import conf from '@lib/conf';
import { InitSetting } from '@types';

/**
 * @description: the **most important** first step for Studio.
 */
async function initStudio({
  name,
  location,
  description,
  locked,
}: InitSetting): Promise<any> {
  try {
    if (hasStudioInited()) {
      return false;
    }

    const root = path.join(location, name);

    const tasks = new Listr([
      {
        title: 'Init Studio dir',
        task: () => {
          mkdirp.sync(path.join(root, '.log'));
          mkdirp.sync(path.join(root, '.storage'));
        },
      },
      {
        title: 'Create configuration',
        task: () => {
          conf.set('root', root);
          conf.set('name', name);
          conf.set('description', description);
          conf.set('locked', locked);
          PATH.ROOT = root;
        },
      },
    ]);

    return tasks.run();
  } catch (error) {
    throw new Error(`Studio init failed: ${error}`);
  }
}

export { initStudio };
