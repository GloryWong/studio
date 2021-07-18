import { prompt } from 'inquirer';

async function promptOpenProject(
  options: any = {}
): Promise<Project.WillOpenProject> {
  const { willOpenProject }: { willOpenProject: Project.WillOpenProject } =
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
