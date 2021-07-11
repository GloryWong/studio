import {Hook} from '@oclif/config'
import {initCLIOrWarning} from '../helper/init'

export const hook: Hook<'init'> = async function ({id}) {
  if ([undefined, 'help', '-h', '--help', '-v', '--version'].includes(id)) {
    return true
  }

  if (!initCLIOrWarning()) {
    this.exit(1)
  }
}
