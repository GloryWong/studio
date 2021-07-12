import { unilog } from '@gloxy/unilog';
import path from 'path';
import execa from 'execa';
import { prompt } from 'inquirer';
import chalk from 'chalk';
import PATH from '../lib/path';
import { get } from '../storage/prj-index';
import * as prj from '../core/prj';
import * as index from '../storage/prj-index';

function openPrj(id: string, reuseWindow = false): void {
  try {
    const prjListItem = get(id);
    if (!prjListItem) {
      unilog.fail(`The prj does not exist`);
      return;
    }

    const { name } = prjListItem;
    const prjPath = path.join(PATH.ROOT, name);
    execa('code', [prjPath, reuseWindow ? '-r' : '']);
    unilog.succeed(
      `Prj '${name}' opened in ${
        reuseWindow ? 'the last active VSCode window' : 'a new VSCode window'
      }`
    );
  } catch (error) {
    throw new Error(`openPrj failed: ${error}`);
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
