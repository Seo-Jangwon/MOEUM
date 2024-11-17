export type ListData = {
  id: string;
  name: string;
  duration: string;
};

export type CardListData = {
  id: string;
  name: string;
  image: string;
};

export type Detail = {
  coverTitle: string;
  listTitle: string;
  cardListTitle: string;
  totalDuration?: string;
  image: string;
  listData: ListData[];
  cardListData?: CardListData[];
};
