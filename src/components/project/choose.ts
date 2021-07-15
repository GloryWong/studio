import { unilog } from '@gloxy/unilog';
import { searchProjectList } from '../project-list';
import { openProject } from './open';

async function chooseProject(text: string): Promise<void> {
  unilog('Choose a project');
  try {
    const projectItem = await searchProjectList(text);

    if (projectItem) {
      openProject(projectItem.id);
    }
  } catch (error) {
    unilog.fail(error);
  }
}

export { chooseProject };
