import conf from '@lib/conf';
import { getProjectCount } from '../project-list';

function getStudioInfo(): any {
  const configuration = conf.store;
  return {
    name: configuration.name,
    location: configuration.root,
    description: configuration.description,
    projectCount: getProjectCount(),
    locked: configuration.locked || false,
  };
}

function setStudioInfo(prop: SettingProp, value: any): void {
  conf.set(prop, value);
}

export { getStudioInfo, setStudioInfo };
