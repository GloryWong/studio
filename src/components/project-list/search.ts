import autocomplete from 'inquirer-autocomplete-prompt';
import { prompt, registerPrompt } from 'inquirer';
import { unilog } from '@gloxy/unilog';
import { get } from '@storage/project-index';
import * as projectList from '@core/project-list';
import { IndexItem, ProjectType } from '@types';
import chalk from 'chalk';

async function searchProjectList(text = ''): Promise<IndexItem | undefined> {
  unilog('Search project');
  try {
    registerPrompt('autocomplete', autocomplete);

    let firstTime = true;
    const { projectId } = await prompt([
      {
        type: 'autocomplete',
        name: 'projectId',
        message: 'Search project:',
        pageSize: 10,
        source: (answers: any, input = '') => {
          let searchParam = '';
          if (firstTime && text) {
            searchParam = text;
            firstTime = false;
          } else {
            searchParam = input.trim();
          }

          const result = projectList
            .searchProjectList(searchParam)
            // wraped to inquirer Choice
            .map(({ id, name, type }) => ({
              name: `${name}${
                type === ProjectType.DEMO ? ` ${chalk.yellow.dim('demo')}` : ''
              }`,
              value: id,
            }));
          return result;
        },
        emptyText: 'No project found',
      },
    ]);

    return get(projectId);
  } catch (error) {
    unilog.fail(error);
    return undefined;
  }
}

export { searchProjectList };
