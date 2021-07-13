import { DateTime } from 'luxon';
import Listr from 'listr';
import conf from '../lib/conf';
import { archive as archiveStudio } from '../command-helper/archive';

async function archive(archiveName?: string): Promise<void> {
  try {
    const root = conf.get('root');

    const tasks = new Listr([
      {
        title: `Move Studio folder '${archiveName}' to archive`,
        task: () => archiveStudio(root, `${archiveName}.${DateTime.now()}`),
      },
      {
        title: "Delete 'root' in configuration",
        task: () => {
          conf.delete('root');
        },
      },
    ]);

    return tasks.run();
  } catch (error) {
    throw new Error(`Studio archive failed: ${error}`);
  }
}

export default archive;
export { archive };
