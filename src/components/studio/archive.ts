import { unilog } from '@gloxy/unilog';
import chalk from 'chalk';
import { prompt } from 'inquirer';
import * as studio from '@core/studio';
import conf from '@lib/conf';
import * as utility from '@lib/utility';

async function archiveStudio(): Promise<void> {
  unilog('Archive Studio');
  try {
    if (conf.get('locked')) {
      unilog.warn(
        `Studio is ${chalk.yellow.bold('locked')} and cannot be archived.`
      );
      return;
    }

    const name = conf.get('name');
    const answers = await prompt([
      {
        type: 'confirm',
        name: 'willArchive',
        message: `Are you sure you want to archive Studio ${chalk.bold.yellow(
          name
        )}?`,
        default: false,
      },
      {
        type: 'input',
        name: 'name',
        message: `Please confirm the Studio name:`,
        validate: (input) => {
          if (input !== name) {
            return 'Studio name not matched.';
          }

          return true;
        },
        when: ({ willArchive }) => willArchive,
      },
      {
        type: 'input',
        name: 'archiveName',
        message: `Name the archive:`,
        default: name,
        filter: (input: string) => input.trim(),
        validate: (input) => {
          if (!utility.isValidFileName(input)) {
            return 'Invalid file name';
          }

          return true;
        },
        when: ({ willArchive }) => willArchive,
      },
    ]);

    if (answers.willArchive) {
      await studio.archiveStudio(answers.archiveName);
      unilog.succeed(`Studio ${chalk.bold.yellow(name)} archived`);
    }
  } catch (error) {
    unilog.fail(error);
  }
}

export { archiveStudio };
