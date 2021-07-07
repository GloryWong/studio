import {Command} from '@oclif/command'
import {init} from '../core/studio-init'

export class InitCommand extends Command {
  static description = 'Init a Studio';

  static args = [
    {
      name: 'path',
    },
  ];

  async run() {
    const {args} = this.parse(InitCommand)
    init(args.path)
  }
}
