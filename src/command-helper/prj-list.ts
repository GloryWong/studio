import autocomplete from 'inquirer-autocomplete-prompt';
import inquirer, { prompt } from 'inquirer';
import columns from 'cli-columns';
import { unilog } from '@gloxy/unilog';
import chalk from 'chalk';
import { getByName } from '../storage/prj-index';
import { searchPrjList, getPrjList } from '../core/prj-list';

function displayList() {
  unilog('Display list');
  try {
    const prjList = getPrjList();

    const formatedList = prjList.map(
      ({ code, name }: { code: number; name: string }) => {
        return `[${chalk.bold.green(code)}] ${chalk.bold(name)}`;
      }
    );

    // eslint-disable-next-line no-console
    console.log(columns(formatedList));
  } catch (error) {
    unilog.fail(error);
  }
}

async function search(text = ''): Promise<IndexItem | undefined> {
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
        source: (answers: any, input: string): Promise<PrjList> => {
          let searchParam = '';
          if (firstTime && text) {
            searchParam = text;
            firstTime = false;
          } else {
            searchParam = input;
          }

          return Promise.resolve(searchPrjList(searchParam));
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

export { displayList, search };
