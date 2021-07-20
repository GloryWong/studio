import * as type from '@core/project';
import { unilog } from '@gloxy/unilog';
import { prompt } from 'inquirer';
import { searchProjectList } from '../project-list';
import { questionProjectTypeSetting } from './questions';

async function infoProject(action: 'get' | 'set'): Promise<void> {
  unilog('Info Project');
  try {
    const projectItem = await searchProjectList();
    if (action === 'get') {
      unilog.mid('').info(projectItem);
      return;
    }

    if (projectItem && action === 'set') {
      const { property } = await prompt([
        {
          type: 'list',
          name: 'property',
          message: 'Choose property to set:',
          choices: ['type'],
          default: 0,
        },
      ]);

      if (property === 'type') {
        const { projectType } = await prompt([questionProjectTypeSetting]);
        type.setProjectType(projectItem.id, projectType);
        unilog.succeed(`Project type set`);
      }
    }
  } catch (error) {
    unilog.fail(error);
  }
}

export { infoProject };
