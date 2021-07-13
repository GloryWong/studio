import fs from 'fs';
import path from 'path';
import copy from 'recursive-copy';
import os from 'os';

async function archive(
  source: string,
  destName: string,
  subpath = ''
): Promise<void> {
  try {
    const archivedPath = path.join(
      process.env.HOME || os.homedir(),
      process.env.STUDIO_ARCHIVE_DIR || '',
      subpath,
      destName
    );
    await copy(source, archivedPath);
    fs.rmdirSync(source, {
      recursive: true,
    });
  } catch (error) {
    throw new Error(`archive failed: ${error}`);
  }
}

export default archive;
export { archive };
