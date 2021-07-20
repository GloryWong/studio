import storage from '@lib/storage';
import { Index, IndexItem } from '@types';

// Note: the array index of item in INDEX storage as Code

// constants
const INDEX_NAME: string = process.env.STUDIO_INDEX_NAME || '';
const INDEX_DEFAULT_VALUE: Index = [];

export {
  add,
  get,
  setProperty,
  getProperty,
  remove,
  getAll,
  getIdByCode,
  removeByCode,
  getByCode,
  existsByName,
  getByName,
};

function getAll(): Index {
  try {
    return storage.get(INDEX_NAME, JSON.stringify(INDEX_DEFAULT_VALUE));
  } catch (error) {
    throw new Error(`getAll failed: ${error}`);
  }
}

function setAll(value: Index) {
  try {
    storage.set(INDEX_NAME, value);
  } catch (error) {
    throw new Error(`setAll failed: ${error}`);
  }
}

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
    throw new Error(`addToIndex failed: ${error}`);
  }
}

function setProperty(id: string, property: string, value: any): void {
  try {
    const index: Index = getAll();
    const i = index.findIndex(({ id: _id }) => _id === id);
    const indexItem = index[i];
    if (indexItem) {
      indexItem[property] = value;
      index.splice(i, 1, indexItem);
      setAll(index);
    }
  } catch (error) {
    throw new Error(`set project property failed: ${error}`);
  }
}

function getProperty(id: string, property: string): any {
  try {
    const index: Index = getAll();
    const indexItem = index.find(({ id: _id }) => _id === id);
    return indexItem && indexItem[property];
  } catch (error) {
    throw new Error(`get project property failed: ${error}`);
  }
}

function get(id: string): IndexItem | undefined {
  try {
    const index: Index = getAll();
    return index.find((item: IndexItem) => item.id === id);
  } catch (error) {
    throw new Error(`get failed: ${error}`);
  }
}

function remove(id: string): void {
  try {
    const index = getAll();
    const i = index.findIndex((item) => item.id === id);
    index.splice(i, 1);
    setAll(index);
  } catch (error) {
    throw new Error(`removeFromIndex failed: ${error}`);
  }
}

function getByName(name: string): IndexItem | undefined {
  try {
    return getAll().find((item: IndexItem) => item.name === name);
  } catch (error) {
    throw new Error(`getByName failed: ${error}`);
  }
}

function existsByName(name: string): boolean {
  try {
    const index = getAll();
    return !!index.find(({ name: _name }) => _name === name);
  } catch (error) {
    throw new Error(`exists failed: ${error}`);
  }
}

function getByCode(code: number): IndexItem {
  try {
    const index: Index = getAll();
    return index[code];
  } catch (error) {
    throw new Error(`getByCode failed: ${error}`);
  }
}

function removeByCode(code: number): void {
  try {
    const index: Index = getAll();
    index.splice(code, 1);
    setAll(index);
  } catch (error) {
    throw new Error(`removeByCode failed: ${error}`);
  }
}

function getIdByCode(code: number): string {
  try {
    return getByCode(code)?.id;
  } catch (error) {
    throw new Error(`getIdByCode failed: ${error}`);
  }
}
