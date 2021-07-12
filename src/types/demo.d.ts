type PrjTag = {
  id: string;
  name: string;
};

type Prj = {
  id: string;
  name: string;
  tags?: Array<PrjTag>;
};
