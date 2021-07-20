import { ProjectType } from '@types';
import { validateProjectName } from './validation';

const questionProjectTypeSetting = {
  type: 'list',
  name: 'projectType',
  message: 'Choose project type',
  choices: [
    {
      name: 'Demo',
      value: ProjectType.DEMO,
    },
    {
      name: 'Formal project',
      value: ProjectType.PROJECT,
    },
  ],
  default: 0,
};

const questionProjectName = {
  type: 'input',
  name: 'name',
  message: 'Name your project:',
  filter: (input: string) => input.trim(),
  validate: (input: string) => {
    if (input.length === 0) {
      return 'Please input a name for your project.';
    }

    return validateProjectName(input);
  },
};

export { questionProjectTypeSetting, questionProjectName };
