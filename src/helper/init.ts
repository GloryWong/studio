import PATH from '../lib/path'
import conf from '../lib/conf'
import storage from '../lib/storage'
import {hasInited} from '../core/studio-init'
import {unilog} from '@gloxy/unilog'

function initCLI() {
  // init PATH
  PATH.ROOT = String(conf.get('root'))

  // init storage
  storage.init(PATH.STORAGE)
}

function initCLIOrWarning(): boolean {
  if (hasInited()) {
    initCLI()
    return true
  }
  unilog.warn('Studio does not exist, please init first.')
  return false
}

export {
  initCLI,
  initCLIOrWarning,
}
