import { unilog } from '@gloxy/unilog';
import { prompt } from 'inquirer';
import chalk from 'chalk';
import * as prj from '../core/prj';
import * as index from '../storage/prj-index';

function openPrj(id: string, reuseWindow = false): void {
  try {
    prj.openPrj(id, reuseWindow);
    unilog.succeed(
      `project opened ${
        reuseWindow ? 'in last active window' : 'in a new window'
      }`
    );
  } catch (error) {
    unilog.fail('Open project failed:', error);
  }
}

async function createPrj(name: string): Promise<void> {
  try {
    const id = prj.createPrj(name);

    const { question }: { question: boolean } = await prompt({
      type: 'confirm',
      name: 'question',
      message: `Created successfully. Wanna open prj ${chalk.yellow(
        name
      )} in new window?`,
    });

    if (question) {
      openPrj(id);
    }
  } catch (error) {
    unilog.fail('Create prj failed:', error);
  }
}

async function archivePrj(id: string): Promise<void> {
  try {
    const prjListItem = index.get(id);
    if (!prjListItem) {
      unilog.fail(`The prj does not exist`);
      return;
    }

    const { name: prjName } = prjListItem;

    const { question }: { question: boolean } = await prompt({
      type: 'confirm',
      name: 'question',
      message: `Are you sure to archive prj '${prjName}'?`,
    });

    if (question) {
      await prj.archivePrj(id);
      unilog.succeed(`prj '${prjName}' archived`);
    }
  } catch (error) {
    throw new Error(`archivePrj failed: ${error}`);
  }
}

export { createPrj, openPrj, archivePrj };
