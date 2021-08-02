import path from 'path';
import execa from 'execa';
import * as projectIndex from '@storage/project-index';
import PATH from '@lib/path';
import fs from 'fs';

function openProject(id: string, reuseWindow = false): void {
  try {
    const projectListItem = projectIndex.get(id);
    if (!projectListItem) {
      throw new Error(`The project does not exist`);
    }

    const { name } = projectListItem;
    let projectPath = path.join(PATH.ROOT, name);

    // check if it is a workspace
    const files = fs.readdirSync(projectPath);
    const workspace = files.find((v) => v.endsWith('.code-workspace'));
    if (workspace) {
      projectPath = path.join(projectPath, workspace);
    }

    execa.sync('code', [projectPath, reuseWindow ? '-r' : '']);
  } catch (error) {
    throw new Error(`openProject failed: ${error}`);
  }
}

export { openProject };
