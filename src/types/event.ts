export type EventBook = {
  id: string;
  title: string;
  author: string;
  coverUrl: string | null;
};

export type EventLocation = {
  name: string;
  address: string | null;
};

export type EventHost = {
  id: string;
  name: string;
  photoUrl: string | null;
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
  location: EventLocation | null;
  host: EventHost | null;
};
