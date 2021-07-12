import { unilog } from '@gloxy/unilog';
import { setInfo } from '../core/infoStudio';

function lockStudio(lock: boolean): void {
  unilog('Lock Studio');
  try {
    setInfo('locked', lock);
    unilog.succeed(`Studio was ${lock ? '' : 'un'}locked`);
  } catch (error) {
    unilog.fail(error);
  }
}

export default lockStudio;
export { lockStudio };
