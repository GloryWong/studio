declare namespace Project {
  export type ProjectTag = {
    id: string;
    name: string;
  };

  export type Project = {
    id: string;
    name: string;
    tags?: Array<ProjectTag>;
  };

  export enum WillOpenProject {
    NOT_OPEN = 0,
    OPEN_IN_NEW_WINDOW,
    RESUME_WINDOW,
  }
}
