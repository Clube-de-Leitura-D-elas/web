import { useState } from 'react';
import { LuBookOpen } from 'react-icons/lu';
import { interpolate, locale } from '../../locales';
import type { EventBook as EventBookData } from '../../types/event';
import * as Styled from './styles';

type EventBookProps = {
  book: EventBookData | null | undefined;
};

export const EventBook = ({ book }: EventBookProps) => {
  // guarda a URL que falhou (e não um booleano): se a capa mudar, a nova URL volta a ser tentada
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  if (!book) return <Styled.BookEmpty>{locale.event_details.book.empty}</Styled.BookEmpty>;

  const { coverUrl } = book;

  return (
    <Styled.BookRow>
      {coverUrl && coverUrl !== failedUrl ? (
        <Styled.BookCover
          src={coverUrl}
          alt={interpolate(locale.event_details.book.coverAlt, { title: book.title })}
          loading="lazy"
          onError={() => setFailedUrl(coverUrl)}
        />
      ) : (
        <Styled.BookCoverPlaceholder
          role="img"
          aria-label={locale.event_details.book.coverUnavailable}
        >
          <LuBookOpen aria-hidden />
        </Styled.BookCoverPlaceholder>
      )}

      <Styled.BookInfo>
        <Styled.BookTitle>{book.title}</Styled.BookTitle>
        <Styled.BookAuthor>{book.author}</Styled.BookAuthor>
      </Styled.BookInfo>
    </Styled.BookRow>
  );
};
