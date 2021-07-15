import { Command } from 'commander';
import { unilog } from '@gloxy/unilog';
import { prepareCommand } from '../utils/prepare';
import { hasStudioInited } from '../utils/init';

function preAction(thisCommand: any): void {
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
      unilog.warn('Studio does not exist, please init first.');
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
