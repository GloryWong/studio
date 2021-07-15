import { Command } from 'commander';
import { unilog } from '@gloxy/unilog';
import { prompt } from 'inquirer';
import { prepareCommand } from '../utils/prepare';
import { hasStudioInited } from '../utils/init';
import { initStudio } from '../components/studio';

async function preAction(thisCommand: any): Promise<void> {
  // unilog.info(thisCommand);

  if (
    thisCommand.cmdOptions.helpByDefault &&
    thisCommand.options.length > 0 &&
    Object.keys(thisCommand.opts()).length === 0 &&
    thisCommand.processedArgs.filter((v: any) => v !== undefined).length === 0
  ) {
    thisCommand.help();
  }

  if (thisCommand.cmdOptions.needPrepareCommand) {
    if (!hasStudioInited()) {
      unilog.warn(
        `Studio does not exist. So cannot execute command '${thisCommand.name()}'.`
      );
      const { willInit, stepInit } = await prompt([
        {
          type: 'confirm',
          name: 'willInit',
          message: 'Do you wannt to create studio?',
          default: false,
        },
        {
          type: 'list',
          name: 'stepInit',
          message: 'Choose a way to create studio:',
          when: ({ willInit: wi }) => wi,
          choices: [
            {
              name: 'Step by step',
              value: 'step',
            },
            {
              name: 'Use default settings',
              value: 'default',
            },
          ],
          default: 0,
        },
      ]);

      if (willInit) {
        await initStudio(!stepInit);
      }
      process.exit(1);
    }
    prepareCommand();
  }
}

function postAction(): void {}

class StudioCommand extends Command {
  private cmdOptions = {
    needPrepareCommand: true,
    helpByDefault: false, // set true to show help by default if the command requires at least one valid 'arg or option'
  };

  constructor(
    cmdOptions: { needPrepareCommand?: boolean; helpByDefault?: boolean } = {},
    name?: string
  ) {
    super(name);
    this.cmdOptions = {
      ...this.cmdOptions,
      ...cmdOptions,
    };
    this.hook('preAction', preAction).hook('postAction', postAction);
  }
}

export * from 'commander';
export { StudioCommand as Command };
