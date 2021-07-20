import * as projectIndex from '@storage/project-index';
import storage from '@lib/storage';
import { ProjectType } from '@types';

function getProjectType(id: string): ProjectType {
  return projectIndex.getProperty(id, 'type');
}

function setProjectType(id: string, type: ProjectType) {
  projectIndex.setProperty(id, 'type', type);
  const p = storage.get(id, '');
  storage.set(id, {
    ...p,
    type,
  });
}

export { setProjectType, getProjectType };
