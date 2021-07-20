export const enum ProjectType {
  DEMO = 0,
  PROJECT,
}

export const enum InstallPkgDepsStatus {
  SUCCESS = 0,
  NO_DEPS_INFO,
  INSTALL_FAILED,
}

export const enum WillOpenProject {
  NOT_OPEN = 0,
  OPEN_IN_NEW_WINDOW,
  RESUME_WINDOW,
}

export type Index = Array<IndexItem>;
export interface IndexItem {
  id: string;
  [key: string]: any;
}

export type ProjectTag = {
  id: string;
  name: string;
};

export type Project = {
  id: string;
  name: string;
  type: ProjectType;
  tags?: Array<ProjectTag>;
};

export type ProjectListItem = {
  id: string;
  name: string;
  code: number;
  type: ProjectType;
  tags?: ProjectTag;
};
export type ProjectList = Array<ProjectListItem>;

export type SettingProp = 'description' | 'locked';

export type InitSetting = {
  name: string;
  location: string;
  description: string;
  locked: boolean;
};
