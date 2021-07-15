import { Command } from '../base/commander';
import { infoStudio } from '../components/studio';

new Command()
  .action(() => {
    infoStudio();
  })
  .parseAsync();
