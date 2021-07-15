import conf from '../lib/conf';

function hasStudioInited(): boolean {
  return conf.has('root');
}

export { hasStudioInited };
