type ProjectTag = {
  id: string;
  name: string;
};

type Project = {
  id: string;
  name: string;
  tags?: Array<ProjectTag>;
};
