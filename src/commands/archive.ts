import {archive} from '../core/studio-archive'
import {initCLIOrWarning} from '../helper/init'
import {prompt} from 'inquirer'
import PATH from '../lib/path'
import path from 'path'
import conf from '../lib/conf'
import chalk from 'chalk'
import {getInfo} from '../core/studio-info'
import Command, {flags} from '@oclif/command'
import {archiveDemo} from '../core/proj'
import * as index from '../storage'

export default class Archive extends Command {
  static flags = {
    studio: flags.boolean({
      description: 'Archive the studio',
      default: false,
    }),
  }

  async run() {
    const {flags} = this.parse(Archive)
    if (flags.studio) {
      this.archiveStudio()
    } else {
      this.warn('not implemented yet')
      // TODO: archive proj
      // this.archiveProj('')
    }
  }

  async archiveProj(id: string) {
    try {
      const demoIndexItem = index.get(id)
      if (!demoIndexItem) {
        this.error('The demo does not exist')
      }

      const {name: demoName} = demoIndexItem

      const {question}: { question: boolean } = await prompt({
        type: 'confirm',
        name: 'question',
        message: `Are you sure to archive demo '${demoName}'?`,
      })

      if (question) {
        await archiveDemo(id)
        this.log(`demo '${demoName}' archived`)
      }
    } catch (error) {
      this.error(`archiveDemo failed: ${error}`, {exit: 1})
    }
  }

  async archiveStudio() {
    try {
      if (!initCLIOrWarning()) {
        return
      }

      if (getInfo().locked) {
        this.warn(`Studio is ${chalk.yellow.bold('locked')} and cannot be archived.`)
        return
      }

      const {name: studioName} = path.parse(PATH.ROOT)
      const {question}: { question: boolean } = await prompt({
        type: 'confirm',
        name: 'question',
        message: `Are you sure to archive Studio ${chalk.bold.yellow(studioName)}?`,
      })

      if (!question) {
        return
      }

      const {studioName: _studioName}: { studioName: string } = await prompt({
        type: 'input',
        name: 'studioName',
        message: 'Please confirm the Studio name:',
      })

      if (_studioName.trim() !== studioName) {
        this.error('Studio name not matched. Archive failed.', {exit: 1})
      }

      const {archiveName}: { archiveName: string} = await prompt({
        type: 'input',
        name: 'archiveName',
        message: 'Give an archive name for this Studio:',
        default: () => {
          const root = String(conf.get('root'))
          const {name} = path.parse(root)

          return name
        },
      })

      await archive(archiveName)
      this.log(`Studio ${chalk.bold.yellow(studioName)} archived`)
    } catch (error) {
      this.error('Archive failed:', error)
    }
  }
}
