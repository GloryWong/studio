import { Command } from 'commander';
import { unilog } from '@gloxy/unilog';
import boxen from 'boxen';
import chalk from 'chalk';
import cfonts from 'cfonts';
import { cliVersion } from '../command-helper/cliInfo';
import { getInfo } from '../core/studio-info';
import { initCLIOrWarning } from '../command-helper/init';

new Command()
  .action(function action() {
    try {
      if (!initCLIOrWarning()) {
        return;
      }

      const { location, name, description, prjCount, locked } = getInfo();
      const bigTitle = cfonts.render('GPrj CLI', {
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
        ${chalk.bold.green('GPrj CLI')} ${chalk.bold.yellow(cliVersion)}${
        process.env.NODE_ENV === 'test' ? ` ${chalk.bgMagenta(' test ')}` : ''
      }
        ${chalk.white('Author: Wang Zhaohui (https://zhaozhao.today)')}

        Present Studio:
          Name: ${chalk.bold(name)}
          Location: ${location}
          Description: ${description}
          Prj count: ${prjCount}
          Locked: ${locked}
      `;
      console.log(boxen(info, { padding: 1, borderStyle: 'double' }));
    } catch (error) {
      unilog.fail('Output Studio info failed', error);
    }
  })
  .parse();
