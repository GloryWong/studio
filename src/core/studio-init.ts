import {unilog} from '@gloxy/unilog'
import conf from '../lib/conf'
import path from 'path'
import PATH from '../lib/path'
import Listr from 'listr'
import fs from 'fs/promises'

function hasInited(): boolean {
  return conf.has('root')
}

/**
 * @description: the **most important** first step for Studio.
 * @param {string} studioPath - the Studio location
 */
async function init(studioPath = 'MyStudioTest'): Promise<boolean> {
  unilog('init Studio')
  try {
    if (hasInited()) {
      unilog.warn('Studio has existed.')
      return false
    }

    const root = path.resolve(studioPath)
    const {name: studioName} = path.parse(root)

    const tasks = new Listr([
      {
        title: 'Init Studio dir',
        task: async () => {
          await fs.mkdir(path.join(root, '.log'), {
            recursive: true,
          })
          await fs.mkdir(path.join(root, '.storage'))
        },
      },
      {
        title: 'Create configuration',
        task: () => {
          conf.set('root', root)
          conf.set('name', studioName)
          conf.set('description', 'My Studio')
          conf.set('locked', true)
          PATH.ROOT = root
        },
      },
    ])

    await tasks.run()

    unilog.succeed(`Studio was created successfully located in \n${root}.`)

    return true
  } catch (error) {
    unilog.fail('Failed to init Studio:', error)
    return false
  }
}

export {
  init,
  hasInited,
}
