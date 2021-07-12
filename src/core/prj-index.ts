import Fuse from 'fuse.js';
import * as index from '../storage/index';

function getPrjIndex(): PrjIndex {
  try {
    const indexAll = index.getAll();
    const prjIndex: PrjIndex = indexAll.map(({ name, id }, i) => ({
      id,
      name,
      code: i, // init code
    }));

    return prjIndex;
  } catch (error) {
    throw new Error(`get prj list failed: ${error}`);
  }
}

function getPrjCount(): number {
  try {
    const indexAll = index.getAll();
    return indexAll.length;
  } catch (error) {
    throw new Error(`get prj count failed: ${error}`);
  }
}

function searchPrjIndex(str: string): PrjIndex {
  try {
    const prjIndex = getPrjIndex();
    const fuse = new Fuse(prjIndex, {
      includeScore: true,
      keys: ['name'],
    });

    const result = fuse.search(str);

    return result.map(({ item }: { item: any }, i: number) => ({
      ...item,
      code: i, // regenerate code for search result
    }));
  } catch (error) {
    throw new Error(`searchPrjIndex failed: ${error}`);
  }
}

export { getPrjIndex, searchPrjIndex, getPrjCount };
