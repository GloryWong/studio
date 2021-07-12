import { prompt } from 'inquirer';
import boxen from 'boxen';
import columns from 'cli-columns';
import chalk from 'chalk';
import ora from 'ora';
import { unilog } from '@gloxy/unilog';
import * as prj from './prj';
import { getPrjList, searchPrjList } from '../core/prj-list';

function listPrjs(list: PrjList): boolean {
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

async function choosePrj(prjList: PrjList): Promise<boolean> {
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

    const prjListItem = prjList.find(({ code }) => Number(prjCode) === code);
    if (!prjListItem) {
      return false;
    }

    const { id: prjId } = prjListItem;
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
    const prjList = getPrjList();
    spinner.succeed(`${chalk.bold(prjList.length)} prj(s) found`);
    listPrjs(prjList);
  } catch (error) {
    spinner.fail('Failed to list all prjs');
    unilog.mid('').fail(error);
  }
}

async function searchPrjs(str: string): Promise<PrjList> {
  const spinner = ora(`Searching ${chalk.bold.yellow(str)}`).start();
  try {
    const prjList = searchPrjList(str);
    spinner.succeed(
      `${chalk.bold(prjList.length)} prj(s) found matched ${chalk.bold.yellow(
        str
      )}`
    );

    if (prjList.length === 0) {
      const { question } = await prompt({
        type: 'confirm',
        name: 'question',
        message: `Wanna create prj ${chalk.yellow(str)}?`,
      });
      if (question) {
        prj.createPrj(str);
      }
    } else {
      listPrjs(prjList);
    }
    return prjList;
  } catch (error) {
    spinner.fail(`Failed to find prjs matched ${chalk.bold.yellow(str)}`);
    unilog.mid('').fail(error);
    return [];
  }
}

async function searchAndChoosePrj(str: string): Promise<void> {
  try {
    const prjList = await searchPrjs(str);
    if (!prjList.length) {
      return;
    }

    if (!(await choosePrj(prjList))) {
      searchAndChoosePrj(str);
    }
  } catch (error) {
    unilog.mid('').fail('search and choose prj failed:', error);
  }
}

export { listAllPrjs, searchAndChoosePrj };
