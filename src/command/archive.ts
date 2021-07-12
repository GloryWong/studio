import { Command } from 'commander';
import { unilog } from '@gloxy/unilog';
import { prompt } from 'inquirer';
import path from 'path';
import chalk from 'chalk';
import { archive } from '../core/studio-archive';
import { initCLIOrWarning } from '../command-helper/init';
import PATH from '../lib/path';
import conf from '../lib/conf';
import { getInfo } from '../core/studio-info';

new Command()
  .action(async function action() {
    unilog('Archive Studio');
    try {
      if (!initCLIOrWarning()) {
        return;
      }

      if (getInfo().locked) {
        unilog.warn(
          `Studio is ${chalk.yellow.bold('locked')} and cannot be archived.`
        );
        return;
      }

      const { name: studioName } = path.parse(PATH.ROOT);
      const { question }: { question: boolean } = await prompt({
        type: 'confirm',
        name: 'question',
        message: `Are you sure to archive Studio ${chalk.bold.yellow(
          studioName
        )}?`,
      });

      if (!question) {
        return;
      }

      const { studioName: sn }: { studioName: string } = await prompt({
        type: 'input',
        name: 'studioName',
        message: `Please confirm the Studio name:`,
      });

      if (sn.trim() !== studioName) {
        unilog.fail('Studio name not matched. Archive failed.');
        return;
      }

      const { archiveName }: { archiveName: string } = await prompt({
        type: 'input',
        name: 'archiveName',
        message: `Give an archive name for this Studio:`,
        default: () => {
          const root = String(conf.get('root'));
          const { name } = path.parse(root);

          return name;
        },
      });

      await archive(archiveName);
      unilog.succeed(`Studio ${chalk.bold.yellow(studioName)} archived`);
    } catch (error) {
      unilog.fail('Archive failed:', error);
    }
  })
  .parse();
