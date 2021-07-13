import { unilog } from '@gloxy/unilog';
import path from 'path';
import Listr from 'listr';
import mkdirp from 'mkdirp';
import PATH from '../lib/path';
import conf from '../lib/conf';

export { init, hasInited };

function hasInited(): boolean {
  return conf.has('root');
}

/**
 * @description: the **most important** first step for Studio.
 */
async function init({
  name,
  location,
  description,
  locked,
}: InitSetting): Promise<boolean> {
  unilog('init Studio');
  try {
    if (hasInited()) {
      unilog.warn('Studio has existed.');
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

    await tasks.run();

    unilog.succeed(`Studio was created successfully located in \n${root}.`);

    return true;
  } catch (error) {
    unilog.fail('Failed to init Studio:', error);
    return false;
  }
}
