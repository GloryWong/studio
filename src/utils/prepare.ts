import PATH from '../lib/path';
import conf from '../lib/conf';
import storage from '../lib/storage';

function prepareCommand(): void {
  try {
    // init PATH
    PATH.ROOT = String(conf.get('root'));

    // init storage
    storage.init(PATH.STORAGE);
  } catch (error) {
    throw new Error(`prepareCommand failed: ${error}`);
  }
}

export { prepareCommand };
