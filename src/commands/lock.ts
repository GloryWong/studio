import { Command } from '@base/commander';
import { lockStudio } from '@components/studio';

new Command({ helpByDefault: true })
  .option('--studio', 'lock studio')
  .option('--no-studio', 'unlock studio')
  // .option('--project', 'lock a project')
  .action(({ studio }) => {
    lockStudio(studio);
  })
  .parseAsync();
