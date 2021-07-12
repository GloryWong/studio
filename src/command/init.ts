import { Command } from 'commander';
import { init } from '../core/studio-init';

new Command()
  .arguments('[path]')
  .action(function action(studioPath: string) {
    init(studioPath);
  })
  .parse();
