import { unilog } from '@gloxy/unilog';
import * as studio from '@core/studio';

function lockStudio(lock: boolean): void {
  unilog('Lock Studio');
  try {
    studio.setStudioInfo('locked', lock);
    unilog.succeed(`Studio ${lock ? '' : 'un'}locked`);
  } catch (error) {
    unilog.fail(error);
  }
}

export { lockStudio };
