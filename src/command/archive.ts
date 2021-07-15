/* eslint-disable @typescript-eslint/no-use-before-define */
import { Command } from 'commander';
import { archivePrj } from '../command-helper/prj';
import { initCLIOrWarning } from '../cli-helper/init';
import { archiveStudio } from '../command-helper/studio';

new Command()
  .option('--project <project-name>')
  .option('--studio')
  .description('Archive a project')
  .action(({ project, studio }) => {
    if (!initCLIOrWarning()) {
      return;
    }

    if (project) {
      archivePrj(project);
      return;
    }

    if (studio) {
      archiveStudio();
    }
  })
  .parse();
