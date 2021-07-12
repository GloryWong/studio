import { unilog } from '@gloxy/unilog';
import path from 'path';
import execa from 'execa';
import { prompt } from 'inquirer';
import chalk from 'chalk';
import PATH from '../lib/path';
import { get } from '../storage/index';
import * as demo from '../core/demo';
import * as index from '../storage/index';

function openDemo(id: string, reuseWindow = false): void {
  try {
    const demoIndexItem = get(id);
    if (!demoIndexItem) {
      unilog.fail(`The demo does not exist`);
      return;
    }

    const { name } = demoIndexItem;
    const demoPath = path.join(PATH.ROOT, name);
    execa('code', [demoPath, reuseWindow ? '-r' : '']);
    unilog.succeed(
      `Demo '${name}' opened in ${
        reuseWindow ? 'the last active VSCode window' : 'a new VSCode window'
      }`
    );
  } catch (error) {
    throw new Error(`openDemo failed: ${error}`);
  }
}

async function createDemo(name: string): Promise<void> {
  try {
    const id = demo.createDemo(name);

    const { question }: { question: boolean } = await prompt({
      type: 'confirm',
      name: 'question',
      message: `Created successfully. Wanna open demo ${chalk.yellow(
        name
      )} in new window?`,
    });

    if (question) {
      openDemo(id);
    }
  } catch (error) {
    unilog.fail('Create demo failed:', error);
  }
}

async function archiveDemo(id: string): Promise<void> {
  try {
    const demoIndexItem = index.get(id);
    if (!demoIndexItem) {
      unilog.fail(`The demo does not exist`);
      return;
    }

    const { name: demoName } = demoIndexItem;

    const { question }: { question: boolean } = await prompt({
      type: 'confirm',
      name: 'question',
      message: `Are you sure to archive demo '${demoName}'?`,
    });

    if (question) {
      await demo.archiveDemo(id);
      unilog.succeed(`demo '${demoName}' archived`);
    }
  } catch (error) {
    throw new Error(`archiveDemo failed: ${error}`);
  }
}

export { createDemo, openDemo, archiveDemo };
