import path from 'path';
import Listr from 'listr';
import storage from '../../lib/storage';
import * as projectIndex from '../../storage/project-index';
import PATH from '../../lib/path';
import * as utility from '../../lib/utility';
import conf from '../../lib/conf';

function archiveProject(id: string): Promise<void> {
  try {
    const project: Project.Project = storage.get(id, '');
    const { name: projectName } = project;

    const tasks = new Listr([
      {
        title: `Remove '${projectName}' from Storage`,
        task: () => {
          storage.remove(id);
        },
      },
      {
        title: `Remove '${projectName}' from ProjectList.Index`,
        task: () => {
          projectIndex.remove(id);
        },
      },
      {
        title: `Move project folder '${projectName}' to archive`,
        task: () => {
          const studioName = conf.get('name');
          return utility.archive(
            path.join(PATH.ROOT, projectName),
            `${studioName}.${projectName}.${id}`
          );
        },
      },
    ]);

    return tasks.run();
  } catch (error) {
    throw new Error(`archiveProject failed: ${error}`);
  }
}

export { archiveProject };
