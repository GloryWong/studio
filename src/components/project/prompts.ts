import { prompt } from 'inquirer';
import { WillOpenProject } from '@types';

async function promptOpenProject(options: any = {}): Promise<WillOpenProject> {
  const { willOpenProject }: { willOpenProject: WillOpenProject } =
    await prompt([
      {
        type: 'list',
        name: 'willOpenProject',
        message: 'Open project?',
        choices: [
          {
            name: 'Not open',
            value: WillOpenProject.NOT_OPEN,
          },
          {
            name: 'Open in new window',
            value: WillOpenProject.OPEN_IN_NEW_WINDOW,
          },
          {
            name: 'Open in last active window',
            value: WillOpenProject.RESUME_WINDOW,
          },
        ],
        default: 0,
        ...options,
      },
    ]);

  return willOpenProject;
}

export { promptOpenProject };
