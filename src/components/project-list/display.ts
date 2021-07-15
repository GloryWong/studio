import columns from 'cli-columns';
import { unilog } from '@gloxy/unilog';
import chalk from 'chalk';
import { getProjectList } from '../../core/project-list';

function displayProjectList() {
  unilog('Display list');
  try {
    const projectList = getProjectList();

    const formatedList = projectList.map(
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

export { displayProjectList };
