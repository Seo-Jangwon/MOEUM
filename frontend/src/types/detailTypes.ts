export type ListData = {
  title: string;
  duration: string;
};

export type CardListData = {
  name: string;
  image: string;
};

export type Detail = {
  coverTitle: string;
  listType: string;
  cardListType: string;
  image: string;
  listData: ListData[];
  cardListData: CardListData[];
};
