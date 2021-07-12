import { prompt } from 'inquirer';
import boxen from 'boxen';
import columns from 'cli-columns';
import chalk from 'chalk';
import ora from 'ora';
import { unilog } from '@gloxy/unilog';
import * as demo from './demo';
import { getDemoIndex, searchDemoIndex } from '../core/demoIndex';

function listDemos(list: DemoIndex): boolean {
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
    throw new Error(`listDemos failed: ${error}`);
  }
}

async function chooseDemo(demoIndex: DemoIndex): Promise<boolean> {
  try {
    const { input } = await prompt({
      type: 'input',
      name: 'input',
      message: 'Choose a correct demo code (open demo by default):',
    });

    // parse input: -r for resuing window, -a for archiving demo
    const matches = input
      .trim()
      .match(/^(-r\s+)?(-a\s+)?(\d+)(\s+-r)?(\s+-a)?$/);
    if (!matches) {
      return false;
    }
    const reuseWindow = Boolean(matches[1]) || Boolean(matches[4]);
    const archiveDemo = Boolean(matches[2]) || Boolean(matches[5]);
    const demoCode = matches[3];

    const demoIndexItem = demoIndex.find(
      ({ code }) => Number(demoCode) === code
    );
    if (!demoIndexItem) {
      return false;
    }

    const { id: demoId } = demoIndexItem;
    // archive demo
    if (archiveDemo) {
      demo.archiveDemo(demoId);
      return true;
    }

    demo.openDemo(demoId, reuseWindow);
    return true;
  } catch (error) {
    throw new Error(`chooseDemo failed: ${error}`);
  }
}

function listAllDemos(): void {
  const spinner = ora(`Loading all demos`);
  try {
    const demoIndex = getDemoIndex();
    spinner.succeed(`${chalk.bold(demoIndex.length)} demo(s) found`);
    listDemos(demoIndex);
  } catch (error) {
    spinner.fail('Failed to list all demos');
    unilog.mid('').fail(error);
  }
}

async function searchDemos(str: string): Promise<DemoIndex> {
  const spinner = ora(`Searching ${chalk.bold.yellow(str)}`).start();
  try {
    const demoIndex = searchDemoIndex(str);
    spinner.succeed(
      `${chalk.bold(
        demoIndex.length
      )} demo(s) found matched ${chalk.bold.yellow(str)}`
    );

    if (demoIndex.length === 0) {
      const { question } = await prompt({
        type: 'confirm',
        name: 'question',
        message: `Wanna create demo ${chalk.yellow(str)}?`,
      });
      if (question) {
        demo.createDemo(str);
      }
    } else {
      listDemos(demoIndex);
    }
    return demoIndex;
  } catch (error) {
    spinner.fail(`Failed to find demos matched ${chalk.bold.yellow(str)}`);
    unilog.mid('').fail(error);
    return [];
  }
}

async function searchAndChooseDemo(str: string): Promise<void> {
  try {
    const demoIndex = await searchDemos(str);
    if (!demoIndex.length) {
      return;
    }

    if (!(await chooseDemo(demoIndex))) {
      searchAndChooseDemo(str);
    }
  } catch (error) {
    unilog.mid('').fail('search and choose demo failed:', error);
  }
}

export { listAllDemos, searchAndChooseDemo };
