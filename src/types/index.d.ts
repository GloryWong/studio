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
