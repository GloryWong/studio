import { Command } from '@base/commander';
import { infoStudio } from '@components/studio';
import { infoProject } from '@components/project';

new Command({ helpByDefault: true })
  .description('set or get info of studio or a project')
  .option('--project')
  .option('--studio')
  .option('--get')
  .option('--set')
  .action(({ project, studio, set }) => {
    if (studio) {
      infoStudio();
      return;
    }

    if (project) {
      if (set) {
        infoProject('set');
        return;
      }
      infoProject('get');
    }
  })
  .parseAsync();
