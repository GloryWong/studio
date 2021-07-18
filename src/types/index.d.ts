type Index = Array<IndexItem>;
type IndexItem = {
  id: string;
  name: string;
};

type ProjectTag = {
  id: string;
  name: string;
};

type Project = {
  id: string;
  name: string;
  tags?: Array<ProjectTag>;
};

declare enum WillOpenProject {
  NOT_OPEN = 0,
  OPEN_IN_NEW_WINDOW,
  RESUME_WINDOW,
}

type ProjectListItem = {
  id: string;
  name: string;
  code: number;
  tags?: ProjectTag;
};
type ProjectList = Array<ProjectListItem>;

type SettingProp = 'description' | 'locked';

type InitSetting = {
  name: string;
  location: string;
  description: string;
  locked: boolean;
};

declare enum InstallPkgDepsStatus {
  SUCCESS = 0,
  NO_DEPS_INFO,
  INSTALL_FAILED,
}
