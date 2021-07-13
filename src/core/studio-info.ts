import conf from '../lib/conf';
import { getPrjCount } from './prj-list';

export { getInfo, setInfo };

function getInfo(): any {
  const configuration = conf.store;
  return {
    name: configuration.name,
    location: configuration.root,
    description: configuration.description,
    prjCount: getPrjCount(),
    locked: configuration.locked || false,
  };
}

function setInfo(prop: SettingProp, value: any): void {
  conf.set(prop, value);
}
