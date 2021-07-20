import columns from 'cli-columns';
import { unilog } from '@gloxy/unilog';
import chalk from 'chalk';
import { getProjectList } from '@core/project-list';
import { ProjectType } from '@types';

function displayProjectList() {
  unilog('Display list');
  try {
    const projectList = getProjectList();

    const formatedList = projectList.map(
      ({ name, type }: { name: string; type: ProjectType }) => {
        return `${chalk.bold(
          `${type === ProjectType.DEMO ? chalk.dim(name) : name}`
        )}`;
      }
    );

    // eslint-disable-next-line no-console
    console.log(columns(formatedList));
  } catch (error) {
    unilog.fail(error);
  }
}

export { displayProjectList };
