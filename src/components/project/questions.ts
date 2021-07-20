import { ProjectType } from '@types';

const questionProjectTypeSetting = {
  type: 'list',
  name: 'projectType',
  message: 'Choose project type',
  choices: [
    {
      name: 'Demo (you can chage it to fornaml project later)',
      value: ProjectType.DEMO,
    },
    {
      name: 'Formal project',
      value: ProjectType.PROJECT,
    },
  ],
  default: 0,
};

export { questionProjectTypeSetting };
