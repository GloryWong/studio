import { prompt } from 'inquirer';
import boxen from 'boxen';
import columns from 'cli-columns';
import chalk from 'chalk';
import ora from 'ora';
import { unilog } from '@gloxy/unilog';
import * as prj from './prj';
import { getPrjIndex, searchPrjIndex } from '../core/prj-index';

function listPrjs(list: PrjIndex): boolean {
  try {
    if (!list.length) {
      return false;
    }

    const formatedList = list.map(
      ({ code, name }: { code: number; name: string }) => {
        return `[${chalk.bold.green(code)}] ${chalk.bold(name)}`;
      }
    );

    // eslint-disable-next-line no-console
    console.log(
      boxen(columns(formatedList), {
        padding: 1,
        borderColor: 'gray',
      })
    );

    return true;
  } catch (error) {
    throw new Error(`listPrjs failed: ${error}`);
  }
}

async function choosePrj(prjIndex: PrjIndex): Promise<boolean> {
  try {
    const { input } = await prompt({
      type: 'input',
      name: 'input',
      message: 'Choose a correct prj code (open prj by default):',
    });

    // parse input: -r for resuing window, -a for archiving prj
    const matches = input
      .trim()
      .match(/^(-r\s+)?(-a\s+)?(\d+)(\s+-r)?(\s+-a)?$/);
    if (!matches) {
      return false;
    }
    const reuseWindow = Boolean(matches[1]) || Boolean(matches[4]);
    const archivePrj = Boolean(matches[2]) || Boolean(matches[5]);
    const prjCode = matches[3];

    const prjIndexItem = prjIndex.find(({ code }) => Number(prjCode) === code);
    if (!prjIndexItem) {
      return false;
    }

    const { id: prjId } = prjIndexItem;
    // archive prj
    if (archivePrj) {
      prj.archivePrj(prjId);
      return true;
    }

    prj.openPrj(prjId, reuseWindow);
    return true;
  } catch (error) {
    throw new Error(`choosePrj failed: ${error}`);
  }
}

function listAllPrjs(): void {
  const spinner = ora(`Loading all prjs`);
  try {
    const prjIndex = getPrjIndex();
    spinner.succeed(`${chalk.bold(prjIndex.length)} prj(s) found`);
    listPrjs(prjIndex);
  } catch (error) {
    spinner.fail('Failed to list all prjs');
    unilog.mid('').fail(error);
  }
}

async function searchPrjs(str: string): Promise<PrjIndex> {
  const spinner = ora(`Searching ${chalk.bold.yellow(str)}`).start();
  try {
    const prjIndex = searchPrjIndex(str);
    spinner.succeed(
      `${chalk.bold(prjIndex.length)} prj(s) found matched ${chalk.bold.yellow(
        str
      )}`
    );

    if (prjIndex.length === 0) {
      const { question } = await prompt({
        type: 'confirm',
        name: 'question',
        message: `Wanna create prj ${chalk.yellow(str)}?`,
      });
      if (question) {
        prj.createPrj(str);
      }
    } else {
      listPrjs(prjIndex);
    }
    return prjIndex;
  } catch (error) {
    spinner.fail(`Failed to find prjs matched ${chalk.bold.yellow(str)}`);
    unilog.mid('').fail(error);
    return [];
  }
}

async function searchAndChoosePrj(str: string): Promise<void> {
  try {
    const prjIndex = await searchPrjs(str);
    if (!prjIndex.length) {
      return;
    }

    if (!(await choosePrj(prjIndex))) {
      searchAndChoosePrj(str);
    }
  } catch (error) {
    unilog.mid('').fail('search and choose prj failed:', error);
  }
}

export { listAllPrjs, searchAndChoosePrj };
