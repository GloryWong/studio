import path from 'path';
import execa from 'execa';
import * as projectIndex from '@storage/project-index';
import PATH from '@lib/path';

function openProject(id: string, reuseWindow = false): void {
  try {
    const projectListItem = projectIndex.get(id);
    if (!projectListItem) {
      throw new Error(`The project does not exist`);
    }

    const { name } = projectListItem;
    const projectPath = path.join(PATH.ROOT, name);
    execa.sync('code', [projectPath, reuseWindow ? '-r' : '']);
  } catch (error) {
    throw new Error(`openProject failed: ${error}`);
  }
}

export { openProject };
