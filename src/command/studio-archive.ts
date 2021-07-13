/* eslint-disable @typescript-eslint/no-use-before-define */
import { unilog } from '@gloxy/unilog';
import chalk from 'chalk';
import { prompt } from 'inquirer';
import { Command } from 'commander';
import conf from '../lib/conf';
import { archive } from '../core/studio-archive';
import { isValidFileName } from '../lib/utility';

new Command()
  .action(() => {
    archiveStudio();
  })
  .parse();

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
          if (!isValidFileName(input)) {
            return 'Invalid file name';
          }

          return true;
        },
        when: ({ willArchive }) => willArchive,
      },
    ]);

    if (answers.willArchive) {
      await archive(answers.archiveName);
      unilog.succeed(`Studio ${chalk.bold.yellow(name)} archived`);
    }
  } catch (error) {
    unilog.fail(error);
  }
}
