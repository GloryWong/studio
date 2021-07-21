import { unilog } from '@gloxy/unilog';
import { prompt } from 'inquirer';
import * as project from '@core/project';
import { searchProjectList } from '../project-list';

/**
 * UI: Achive project
 * @param projectName - the project name of which will be archived
 */
async function archiveProject(projectName: string): Promise<void> {
  unilog('Achive project');
  try {
    const projectItem = await searchProjectList(projectName);
    if (!projectItem) {
      unilog.fail('project not exists');
      return;
    }

    const { name, id } = projectItem;

    const { question }: { question: boolean } = await prompt({
      type: 'confirm',
      name: 'question',
      message: `Are you sure you want to archive project '${name}'?`,
      default: false,
    });

    if (question) {
      await project.archiveProject(id);
      unilog.succeed(`project '${name}' archived`);
    }
  } catch (error) {
    unilog(error);
  }
}

export { archiveProject };
