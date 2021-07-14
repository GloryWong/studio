import { readPackageJson } from '../lib/utility';

const { version: cliVersion, description: pkgDescription } = readPackageJson([
  'version',
  'description',
]);
const cliDescription = `Description: ${pkgDescription}`;

const cliUsage = `[optons] [command] [prjSelector]`;

export { cliVersion, cliDescription, cliUsage };
