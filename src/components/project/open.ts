import { unilog } from '@gloxy/unilog';
import { prompt } from 'inquirer';
import * as project from '@core/project';

/**
 * UI: Open a project in default editor
 * @param id - Project id
 * @param options - Addtional options
 *        : reuseWindow - reuse last active window
 */
async function openProject(id: string, options?: any): Promise<void> {
  try {
    let reuseWindow: boolean;
    if (options && Object.keys(options).includes('reuseWindow')) {
      reuseWindow = options.reuseWindow;
    } else {
      const answers = await prompt([
        {
          type: 'confirm',
          name: 'newWindow',
          message: 'Open project in new window?',
          default: true,
        },
      ]);
      reuseWindow = !answers.newWindow;
    }

    project.openProject(id, reuseWindow);
    unilog.succeed(
      `project opened ${
        reuseWindow ? 'in last active window' : 'in a new window'
      }`
    );
  } catch (error) {
    unilog.fail('Open project failed:', error);
  }
}

export { openProject };
