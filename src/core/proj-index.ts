import * as index from '../storage'
import Fuse from 'fuse.js'

function getDemoIndex(): DemoIndex {
  const indexAll = index.getAll()
  const projIndex: DemoIndex = indexAll.map(({name, id}, i) => (
    {
      id,
      name,
      code: i, // init code
    }
  ))

  return projIndex
}

function getDemoCount(): number {
  const indexAll = index.getAll()
  return indexAll.length
}

function searchDemoIndex(str: string): DemoIndex {
  const projIndex = getDemoIndex()
  const fuse = new Fuse(projIndex, {
    includeScore: true,
    keys: ['name'],
  })

  const result = fuse.search(str)

  return result.map(({item}: { item: any }, i: number) => ({
    ...item,
    code: i, // regenerate code for search result
  }))
}

export {
  getDemoIndex,
  searchDemoIndex,
  getDemoCount,
}
