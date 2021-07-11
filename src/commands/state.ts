import Command, {flags} from '@oclif/command'
import {setState} from '../core/studio-state'

export class State extends Command {
  static flags = {
    lock: flags.boolean({
      description: 'lock the Studio or a project',
      default: false,
    }),
    unlock: flags.boolean({
      description: 'unlock the Studio or a project',
      default: false,
    }),
  }

  async run() {
    const {flags} = this.parse(State)
    if (flags.lock) {
      setState('locked', true)
      return
    }

    if (flags.unlock) {
      setState('locked', false)
    }
  }
}
