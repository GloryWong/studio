import { unilog } from '@gloxy/unilog';
import chalk from 'chalk';
import boxen from 'boxen';
import cfonts from 'cfonts';
import * as studio from '../../core/studio';
import { cliVersion } from '../../utils/info';

function infoStudio(): void {
  try {
    const { location, name, description, projectCount, locked } =
      studio.getStudioInfo();
    const bigTitle = cfonts.render('GLOXY', {
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
      ${chalk.bold.green('GLOXY STUDIO CLI')} ${chalk.bold.yellow(cliVersion)}${
      process.env.NODE_ENV === 'test' ? ` ${chalk.bgMagenta(' test ')}` : ''
    }
      ${chalk.white('Author: Wang Zhaohui (https://zhaozhao.today)')}

      Present Studio:
        Name: ${chalk.bold(name)}
        Location: ${location}
        Description: ${description}
        Project count: ${projectCount}
        Locked: ${locked}
    `;
    // eslint-disable-next-line no-console
    console.log(boxen(info, { padding: 1, borderStyle: 'double' }));
  } catch (error) {
    unilog.fail('Output Studio info failed', error);
  }
}

export { infoStudio };
