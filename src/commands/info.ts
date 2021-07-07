import {initCLIOrWarning} from '../helper/init'
import {unilog} from '@gloxy/unilog'
// import {getInfo} from '../core/studio-info'
// import boxen from 'boxen'
// import {cliVersion} from '../helper/info'
// import chalk from 'chalk'
import {Command} from '@oclif/command'

export default class InfoCommand extends Command {
  async run() {
    try {
      if (!initCLIOrWarning()) {
        return
      }

      // const {location, name, description, demoCount, locked} = getInfo()
      // const bigTitle = cfonts.render('GDemo CLI', {
      //   font: 'block',
      //   colors: ['system'],         // define all colors
      //   background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
      //   letterSpacing: 1,           // define letter spacing
      //   lineHeight: 1,              // define the line height
      //   space: true,
      //   gradient: ['red', 'blue'],
      //   env: 'node',
      // })

      // const info = `
      //     ${chalk.bold.green('GDemo CLI')} ${chalk.bold.yellow(cliVersion)}${process.env.NODE_ENV === 'test' ? ' ' + chalk.bgMagenta(' test ') : ''}
      //     ${chalk.white('Author: Wang Zhaohui (https://zhaozhao.today)')}

    //     Present Studio:
    //       Name: ${chalk.bold(name)}
    //       Location: ${location}
    //       Description: ${description}
    //       Demo count: ${demoCount}
    //       Locked: ${locked}
    //   `
    // console.log(boxen(info, {padding: 1, borderStyle: 'double'}))
    } catch (error) {
      unilog.fail('Output Studio info failed', error)
    }
  }
}
