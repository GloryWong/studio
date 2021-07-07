import storage from '../lib/storage'

// Note: the array index of item in INDEX storage as Code

// constants
const INDEX_NAME = '__studio-index__'
const INDEX_DEFAULT_VALUE: Index = []

function getAll(): Index {
  return storage.get(INDEX_NAME, JSON.stringify(INDEX_DEFAULT_VALUE))
}

function setAll(value: Index) {
  storage.set(INDEX_NAME, value)
}

function add(id: string, value: object) {
  const index: Index = getAll()
  const item: IndexItem = {
    id,
    ...value,
  }
  index.push(item)
  setAll(index)
}

function get(id: string): IndexItem | undefined {
  const index: Index = getAll()
  return index.find((item: IndexItem) => item.id === id)
}

function remove(id: string) {
  const index = getAll()
  const i = index.findIndex(item => item.id === id)
  index.splice(i, 1)
  setAll(index)
}

function existsByName(name: string): boolean {
  const index = getAll()
  return Boolean(index.find(({name: _name}) => _name === name))
}

function getByCode(code: number): IndexItem {
  const index: Index = getAll()
  return index[code]
}

function removeByCode(code: number): void {
  const index: Index = getAll()
  index.splice(code, 1)
  setAll(index)
}

function getIdByCode(code: number): string {
  return getByCode(code)?.id
}

export {
  add,
  get,
  remove,
  getAll,
  getIdByCode,
  removeByCode,
  getByCode,
  existsByName,
}
