import PATH from '@lib/path';
import conf from '@lib/conf';
import storage from '@lib/storage';

export function prepareCommand(): void {
  try {
    // init PATH
    PATH.ROOT = String(conf.get('root'));

    // init storage
    storage.init(PATH.STORAGE);
  } catch (error) {
    throw new Error(`prepareCommand failed: ${error}`);
  }
}

export function handleThirdPartyArgs(command: any) {
  const dblDashIndex = command.rawArgs.indexOf('--');
  const thirdPartyArgs =
    dblDashIndex > 0 ? command.rawArgs.slice(dblDashIndex + 1) : [];
  // eslint-disable-next-line no-param-reassign
  command.thirdPartyArgs = thirdPartyArgs;
  // args
  // processedArgs
}
