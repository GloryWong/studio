import {Command} from '@oclif/command'
import {createDemo, openDemo} from '../core/proj'
import {prompt} from 'inquirer'
import chalk from 'chalk'

export default class Create extends Command {
  static args = [
    {
      name: 'name',
    },
  ]

  async run() {
    try {
      const {args} = this.parse(Create)
      const id = createDemo(args.name)

      const {question}: { question: boolean } = await prompt({
        type: 'confirm',
        name: 'question',
        message: `Created successfully. Open demo ${chalk.yellow(args.name)} in new window?`,
      })

      if (question) {
        openDemo(id)
      }
    } catch (error) {
      this.error('Create demo failed:', error)
    }
  }
}
