import autocomplete from 'inquirer-autocomplete-prompt';
import inquirer, { prompt } from 'inquirer';
import { unilog } from '@gloxy/unilog';
import { getByName } from '../../storage/project-index';
import * as projectList from '../../core/project-list';

async function searchProjectList(text = ''): Promise<IndexItem | undefined> {
  unilog('Search project');
  try {
    inquirer.registerPrompt('autocomplete', autocomplete);

    let firstTime = true;
    const { projectName } = await prompt([
      {
        type: 'autocomplete',
        name: 'projectName',
        message: 'Search project:',
        pageSize: 10,
        source: (answers: any, input: string): Promise<ProjectList> => {
          let searchParam = '';
          if (firstTime && text) {
            searchParam = text;
            firstTime = false;
          } else {
            searchParam = input;
          }

          return Promise.resolve(projectList.searchProjectList(searchParam));
        },
        emptyText: 'No project found',
      },
    ]);

    return getByName(projectName);
  } catch (error) {
    unilog.fail(error);
    return undefined;
  }
}

export { searchProjectList };
