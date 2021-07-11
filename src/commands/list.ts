import Command from '@oclif/command'
import chalk from 'chalk'
import ora from 'ora'
import {getDemoIndex} from '../core/proj-index'

function __listDemos(list: DemoIndex): boolean {
  try {
    if (list.length === 0) {
      return false
    }

    list.forEach(({code, name}: { code: number; name: string }) => {
      console.log(`[${chalk.bold.green(String(code))}] ${chalk.bold(name)}`)
    })

    return true
  } catch (error) {
    throw new Error(`__listDemos failed: ${error}`)
  }
}

export default class List extends Command {
  async run(): Promise<void> {
    this.listAllDemos()
  }

  listAllDemos() {
    const spinner = ora('Loading all demos')
    try {
      const demoIndex = getDemoIndex()
      spinner.succeed(`${chalk.bold(String(demoIndex.length))} demo(s) found`)
      __listDemos(demoIndex)
    } catch (error) {
      spinner.fail('Failed to list all demos')
      this.error(error, {exit: 1})
    }
  }
}

export {__listDemos}
