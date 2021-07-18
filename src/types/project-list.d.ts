declare namespace ProjectList {
  export type Index = Array<IndexItem>;
  export type IndexItem = {
    id: string;
    name: string;
  };

  export type ListItem = {
    id: string;
    name: string;
    code: number;
    tags?: ProjectTag;
  };
  export type List = Array<ListItem>;
}
