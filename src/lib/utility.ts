import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import copy from 'recursive-copy';
import os from 'os';
import chalk from 'chalk';
import { readdir } from 'fs/promises';
import execa from 'execa';

function isNumeric(val: string | number): boolean {
  return typeof val === 'number' ? _.isNumber(val) : /^\d+$/.test(val);
}

function isValidFileName(val: string): boolean {
  return /^([^\s\\/]+)$/.test(val);
}

function readPackageJson(keys?: string | string[]): any {
  try {
    const packageJsonPath = path.resolve(__dirname, '../../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    if (!keys) {
      return packageJson;
    }

    if (typeof keys === 'string') {
      return packageJson[keys];
    }

    if (Array.isArray(keys)) {
      const obj: { [key: string]: any } = {};
      keys.forEach((key) => {
        obj[key] = packageJson[key];
      });
      return obj;
    }

    return undefined;
  } catch (error) {
    throw new Error(`readPackageJson failed: ${error}`);
  }
}

async function archive(
  source: string,
  destName: string,
  subpath = ''
): Promise<void> {
  try {
    const archivedPath = path.join(
      process.env.HOME || os.homedir(),
      process.env.STUDIO_ARCHIVE_DIR || '',
      subpath,
      destName
    );
    await copy(source, archivedPath);
    fs.rmdirSync(source, {
      recursive: true,
    });
  } catch (error) {
    throw new Error(`archive failed: ${error}`);
  }
}

function validatePathExist(name: string, location: string): string | boolean {
  const studioPath = path.join(location, name);
  return fs.existsSync(studioPath)
    ? `Directory ${chalk.yellow.bold(name)} has existed in ${chalk.bold(
        location
      )}, please type another name.`
    : true;
}

function validateLocationAccess(location: string): string | boolean {
  try {
    // eslint-disable-next-line no-bitwise
    fs.accessSync(location, fs.constants.R_OK | fs.constants.W_OK);
  } catch (error) {
    return `No access to ${chalk.yellow.bold(location)}: ${error}`;
  }

  return true;
}

async function installPkgDeps(dirPath: string): Promise<number> {
  const files = await readdir(dirPath);
  const cmds = {
    npm: 'npm install',
    yarn: 'npx yarn install',
  };

  let cmd;
  if (files.includes('package-lock.json')) {
    cmd = cmds.npm;
  } else if (files.includes('yarn.lock')) {
    cmd = cmds.yarn;
  } else if (files.includes('package.json')) {
    cmd = cmds.npm;
  } else {
    return installPkgDeps.NO_DEPS_INFO;
  }

  const result = await execa.command(cmd, {
    cwd: dirPath,
  });

  if (result.failed) {
    return installPkgDeps.INSTALL_FAILED;
  }

  return installPkgDeps.SUCCESS;
}
installPkgDeps.SUCCESS = 0;
installPkgDeps.NO_DEPS_INFO = 1;
installPkgDeps.INSTALL_FAILED = 2;

export {
  isNumeric,
  readPackageJson,
  isValidFileName,
  archive,
  validateLocationAccess,
  validatePathExist,
  installPkgDeps,
};
