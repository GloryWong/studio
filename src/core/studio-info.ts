import conf from '../lib/conf'
import {getDemoCount} from './proj-index'

function getInfo() {
  const configuration = conf.store
  return {
    name: configuration.name,
    location: configuration.root,
    description: configuration.description,
    demoCount: getDemoCount(),
    locked: configuration.locked || false,
  }
}

function setInfo(prop: SettingProp, value: any) {
  conf.set(prop, value)
}

export {
  getInfo,
  setInfo,
}
