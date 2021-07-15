import { DateTime } from 'luxon';
import Listr from 'listr';
import conf from '../../lib/conf';
import * as utility from '../../lib/utility';

async function archiveStudio(archiveName?: string): Promise<void> {
  try {
    const root = conf.get('root');

    const tasks = new Listr([
      {
        title: `Move Studio folder '${archiveName}' to archive`,
        task: () => utility.archive(root, `${archiveName}.${DateTime.now()}`),
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

export { archiveStudio };
