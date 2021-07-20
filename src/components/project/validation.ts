import * as projectIndex from '@storage/project-index';
import { isValidFileName } from '@lib/utility';
import chalk from 'chalk';

function validateProjectName(input: string): string | boolean {
  if (!isValidFileName(input)) {
    return 'This name is not a valid file name, choose another name.';
  }

  if (projectIndex.existsByName(input)) {
    return `${chalk.bold.yellow(input)} has existed, choose another name.`;
  }

  return true;
}

export { validateProjectName };
