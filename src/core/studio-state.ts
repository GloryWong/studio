import conf from '../lib/conf'

function getState(field?: string) {
  if (field) {
    return conf.get(field)
  }

  return conf.all
}

function setState(field: string, value: any) {
  conf.set(field, value)
}

export {
  getState,
  setState,
}
