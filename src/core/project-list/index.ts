import Fuse from 'fuse.js';
import * as index from '../../storage/project-index';

function getProjectList(): ProjectList.List {
  try {
    const indexAll = index.getAll();
    const projectList: ProjectList.List = indexAll.map(
      ({ name, id }: { name: string; id: string }, i: number) => ({
        id,
        name,
        code: i, // init code
      })
    );

    return projectList;
  } catch (error) {
    throw new Error(`get project list failed: ${error}`);
  }
}

function getProjectCount(): number {
  try {
    return index.getAll().length;
  } catch (error) {
    throw new Error(`get project count failed: ${error}`);
  }
}

function searchProjectList(str: string): ProjectList.List {
  try {
    const projectList = getProjectList();
    if (!str) {
      return projectList;
    }

    const fuse = new Fuse(projectList, {
      includeScore: true,
      keys: ['name'],
    });

    const result = fuse.search(str);

    return result.map(({ item }, i: number) => ({
      ...item,
      code: i, // regenerate new code for search result
    }));
  } catch (error) {
    throw new Error(`searchProjectList failed: ${error}`);
  }
}

export { getProjectList, searchProjectList, getProjectCount };
