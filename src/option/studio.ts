import { unilog } from '@gloxy/unilog';
import { prompt } from 'inquirer';
import path from 'path';
import chalk from 'chalk';
import boxen from 'boxen';
import cfonts from 'cfonts';
import { init } from '../core/studio-init';
import { setInfo, getInfo } from '../core/studio-info';
import { archive } from '../core/studio-archive';
import PATH from '../lib/path';
import conf from '../lib/conf';
import { cliVersion } from '../command-helper/cli-info';

function lockStudio(lock: boolean): void {
  unilog('Lock Studio');
  try {
    setInfo('locked', lock);
    unilog.succeed(`Studio ${lock ? '' : 'un'}locked`);
  } catch (error) {
    unilog.fail(error);
  }
}

async function initStudio(studioPath: string): Promise<void> {
  unilog('Init Studio');
  try {
    if (await init(studioPath)) {
      unilog.succeed(`Studio created`);
    }
  } catch (error) {
    unilog.fail(error);
  }
}

function infoStudio(): void {
  try {
    const { location, name, description, prjCount, locked } = getInfo();
    const bigTitle = cfonts.render('GPrj CLI', {
      font: 'block',
      colors: ['system'], // define all colors
      background: 'transparent', // define the background color, you can also use `backgroundColor` here as key
      letterSpacing: 1, // define letter spacing
      lineHeight: 1, // define the line height
      space: true,
      gradient: ['red', 'blue'],
      env: 'node',
    });

    const info = `${bigTitle.string}
      ${chalk.bold.green('GPrj CLI')} ${chalk.bold.yellow(cliVersion)}${
      process.env.NODE_ENV === 'test' ? ` ${chalk.bgMagenta(' test ')}` : ''
    }
      ${chalk.white('Author: Wang Zhaohui (https://zhaozhao.today)')}

      Present Studio:
        Name: ${chalk.bold(name)}
        Location: ${location}
        Description: ${description}
        Prj count: ${prjCount}
        Locked: ${locked}
    `;
    // eslint-disable-next-line no-console
    console.log(boxen(info, { padding: 1, borderStyle: 'double' }));
  } catch (error) {
    unilog.fail('Output Studio info failed', error);
  }
}

async function archiveStudio(): Promise<void> {
  unilog('Archive Studio');
  try {
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
    unilog.fail(error);
  }
}

export { lockStudio, initStudio, infoStudio, archiveStudio };
