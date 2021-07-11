import Command from '@oclif/command'
import ora from 'ora'
import chalk from 'chalk'
import {searchDemoIndex} from '../core/proj-index'
import {prompt} from 'inquirer'
import {createDemo, openDemo} from '../core/proj'
import {__listDemos} from './list'

async function __chooseDemo(demoIndex: DemoIndex): Promise<boolean> {
  try {
    const {input} = await prompt({
      type: 'input',
      name: 'input',
      message: 'Choose a correct demo code (open demo by default):',
    })

    const demoIndexItem = demoIndex.find(({code}) => Number(input) === code)
    if (!demoIndexItem) {
      return false
    }

    const {id: demoId} = demoIndexItem

    openDemo(demoId)
    return true
  } catch (error) {
    throw new Error(`__chooseDemo failed: ${error}`)
  }
}

export default class Search extends Command {
  async run() {
    //
  }

  async searchDemos(str: string): Promise<DemoIndex> {
    const spinner = ora(`Searching ${chalk.bold.yellow(str)}`).start()
    try {
      const demoIndex = searchDemoIndex(str)
      spinner.succeed(`${chalk.bold(String(demoIndex.length))} demo(s) found matched ${chalk.bold.yellow(str)}`)

      if (demoIndex.length === 0) {
        const {question} = await prompt({
          type: 'confirm',
          name: 'question',
          message: `Wanna create demo ${chalk.yellow(str)}?`,
        })
        if (question) {
          createDemo(str)
        }
      } else {
        __listDemos(demoIndex)
      }
      return demoIndex
    } catch (error) {
      spinner.fail(`Failed to find demos matched ${chalk.bold.yellow(str)}`)
      this.error(error)
    }
  }

  async searchAndChooseDemo(str: string) {
    try {
      const demoIndex = await this.searchDemos(str)
      if (demoIndex.length === 0) {
        return
      }

      if (!await __chooseDemo(demoIndex)) {
        this.searchAndChooseDemo(str)
      }
    } catch (error) {
      this.error('search and choose demo failed:', error)
    }
  }
}
