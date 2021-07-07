import fs from 'fs'
import path from 'path'
import copy from 'recursive-copy'

async function archive(source: string, destName: string, subpath = '') {
  // move Studio to archive
  const archivedPath = path.join(process.env.HOME!, '.gstudio-archive', subpath, destName)
  await copy(source, archivedPath)
  fs.rmdirSync(source)
}

export {
  archive,
}
