/* eslint-disable @typescript-eslint/no-use-before-define */
import { Command } from '../base/commander';
import { archiveProject } from '../components/project';
import { archiveStudio } from '../components/studio';

new Command({ helpByDefault: true })
  .option('--project [project-name]')
  .option('--studio')
  .description('Archive a project')
  .action(({ project, studio }) => {
    if (project) {
      archiveProject(project);
      return;
    }

    if (studio) {
      archiveStudio();
    }
  })
  .parseAsync();
