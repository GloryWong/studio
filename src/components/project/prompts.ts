import { prompt } from 'inquirer';
import { WillOpenProject } from '@enums';

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
            value: 'NOT_OPEN',
          },
          {
            name: 'Open in new window',
            value: 'OPEN_IN_NEW_WINDOW',
          },
          {
            name: 'Open in last active window',
            value: 'REUSE_WINDOW',
          },
        ],
        default: 0,
        ...options,
      },
    ]);

  return willOpenProject;
}

export { promptOpenProject };
