import { readPackageJson } from '../lib/utility';

const { version: cliVersion, description: pkgDescription } = readPackageJson([
  'version',
  'description',
]);
const cliDescription = `Description: ${pkgDescription}`;

const cliUsage = `[optons] [command] [prjSelector]
  prjSelector: a \`prj code\` from the displayed prj list, opening a prj
                in a new editor window by default.
                Options:
                  * -r: open the prj in the last active editor window
                  * -a: archive the prj`;

export { cliVersion, cliDescription, cliUsage };
