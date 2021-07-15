import { Command } from '../base/commander';
import { displayProjectList } from '../components/project-list';

new Command()
  .action(() => {
    displayProjectList();
  })
  .parseAsync();
