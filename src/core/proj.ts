import storage from '../lib/storage'
import * as index from '../storage'
import {uid} from 'uid/secure'
import mkdirp from 'mkdirp'
import PATH from '../lib/path'
import path from 'path'
import {archive} from '../helper/archive'
import Listr from 'listr'
import execa from 'execa'
import {unilog} from '@gloxy/unilog'

// demo name should be unique in a Studio
function createDemo(name: string): string {
  const id = uid()
  try {
    if (index.existsByName(name)) {
      throw new Error(`same name demo '${name}' already exists`)
    }

    const demo: Demo = {
      id,
      name,
    }

    storage.add(id, demo)
    index.add(id, {
      name,
    })

    // create demo dir
    mkdirp.sync(path.join(PATH.ROOT, name))

    return id
  } catch (error) {
    throw new Error(`createDemo failed: ${error}`)
  }
}

function openDemo(id: string, reuseWindow = false): void {
  try {
    const demoIndexItem = index.get(id)
    if (!demoIndexItem) {
      unilog.fail('The demo does not exist')
      return
    }

    const {name} = demoIndexItem
    const demoPath = path.join(PATH.ROOT, name)
    execa('code', [demoPath, reuseWindow ? '-r' : ''])
    unilog.succeed(`Demo '${name}' opened in ${reuseWindow ? 'the last active VSCode window' : 'a new VSCode window'}`)
  } catch (error) {
    throw new Error(`openDemo failed: ${error}`)
  }
}

function archiveDemo(id: string): Promise<any> {
  try {
    const demo: Demo = storage.get(id, '')
    const {name: demoName} = demo

    const tasks = new Listr([
      {
        title: `Remove '${demoName}' from Storage`,
        task: () => {
          storage.remove(id)
        },
      },
      {
        title: `Remove '${demoName}' from Index`,
        task: () => {
          index.remove(id)
        },
      },
      {
        title: `Move demo folder '${demoName}' to archive`,
        task: () => {
          const {name: studioName} = path.parse(PATH.ROOT)
          return archive(path.join(PATH.ROOT, demoName), `${studioName}.${demoName}.${id}`)
        },
      },
    ])

    return tasks.run()
  } catch (error) {
    throw new Error(`archiveDemo failed: ${error}`)
  }
}

export {
  createDemo,
  openDemo,
  archiveDemo,
}
