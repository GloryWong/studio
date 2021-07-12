import Fuse from 'fuse.js';
import * as index from '../storage/prj-index';

function getPrjList(): PrjList {
  try {
    const indexAll = index.getAll();
    const prjList: PrjList = indexAll.map(({ name, id }, i) => ({
      id,
      name,
      code: i, // init code
    }));

    return prjList;
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

function searchPrjList(str: string): PrjList {
  try {
    const prjList = getPrjList();
    const fuse = new Fuse(prjList, {
      includeScore: true,
      keys: ['name'],
    });

    const result = fuse.search(str);

    return result.map(({ item }: { item: any }, i: number) => ({
      ...item,
      code: i, // regenerate code for search result
    }));
  } catch (error) {
    throw new Error(`searchPrjList failed: ${error}`);
  }
}

export { getPrjList, searchPrjList, getPrjCount };
