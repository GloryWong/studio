import storage from '../lib/storage';

// Note: the array index of item in INDEX storage as Code

// constants
const INDEX_NAME: string = process.env.STUDIO_INDEX_NAME!;
const INDEX_DEFAULT_VALUE: Index = [];

export {
  add,
  get,
  remove,
  getAll,
  getIdByCode,
  removeByCode,
  getByCode,
  existsByName,
};

function add(id: string, value: any): void {
  try {
    const index: Index = getAll();
    const item: IndexItem = {
      id,
      ...value,
    };
    index.push(item);
    setAll(index);
  } catch (error) {
    throw `addToIndex failed: ${error}`;
  }
}

function get(id: string): IndexItem | undefined {
  try {
    const index: Index = getAll();
    return index.find((item: IndexItem) => item.id === id);
  } catch (error) {
    throw `get failed: ${error}`;
  }
}

function remove(id: string): void {
  try {
    const index = getAll();
    const i = index.findIndex((item) => item.id === id);
    index.splice(i, 1);
    setAll(index);
  } catch (error) {
    throw `removeFromIndex failed: ${error}`;
  }
}

function getAll(): Index {
  try {
    return storage.get(INDEX_NAME, JSON.stringify(INDEX_DEFAULT_VALUE));
  } catch (error) {
    throw `getAll failed: ${error}`;
  }
}

function setAll(value: Index) {
  try {
    storage.set(INDEX_NAME, value);
  } catch (error) {
    throw `setAll failed: ${error}`;
  }
}

function existsByName(name: string): boolean {
  try {
    const index = getAll();
    return !!index.find(({ name: _name }) => _name === name);
  } catch (error) {
    throw `exists failed: ${error}`;
  }
}

function getByCode(code: number): IndexItem {
  try {
    const index: Index = getAll();
    return index[code];
  } catch (error) {
    throw `getByCode failed: ${error}`;
  }
}

function removeByCode(code: number): void {
  try {
    const index: Index = getAll();
    index.splice(code, 1);
    setAll(index);
  } catch (error) {
    throw `removeByCode failed: ${error}`;
  }
}

function getIdByCode(code: number): string {
  try {
    return getByCode(code)?.id;
  } catch (error) {
    throw `getIdByCode failed: ${error}`;
  }
}
