export type EventBook = {
  id: string;
  title: string;
  author: string;
  coverUrl: string | null;
};

export type EventDetails = {
  id: string;
  startsAt: string;
  group: {
    id: string;
    name: string;
    city: string;
  };
  book: EventBook | null;
};
