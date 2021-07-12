import Fuse from 'fuse.js';
import * as index from '../storage/index';

function getDemoIndex(): DemoIndex {
  try {
    const indexAll = index.getAll();
    const demoIndex: DemoIndex = indexAll.map(({ name, id }, i) => ({
      id,
      name,
      code: i, // init code
    }));

    return demoIndex;
  } catch (error) {
    throw new Error(`get demo list failed: ${error}`);
  }
}

function getDemoCount(): number {
  try {
    const indexAll = index.getAll();
    return indexAll.length;
  } catch (error) {
    throw new Error(`get demo count failed: ${error}`);
  }
}

function searchDemoIndex(str: string): DemoIndex {
  try {
    const demoIndex = getDemoIndex();
    const fuse = new Fuse(demoIndex, {
      includeScore: true,
      keys: ['name'],
    });

    const result = fuse.search(str);

    return result.map(({ item }: { item: any }, i: number) => ({
      ...item,
      code: i, // regenerate code for search result
    }));
  } catch (error) {
    throw new Error(`searchDemoIndex failed: ${error}`);
  }
}

export { getDemoIndex, searchDemoIndex, getDemoCount };
