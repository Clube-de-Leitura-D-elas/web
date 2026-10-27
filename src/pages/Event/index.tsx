import { useEffect, useState, type ReactNode } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { BackButton } from '../../components/BackButton';
import { Button } from '../../components/Button';
import { NotFound } from '../NotFound';
import { interpolate, locale } from '../../locales';
import { getEventDetails } from '../../services/eventService';
import type { EventDetails as EventDetailsData } from '../../types/event';
import { formatEventDateTime } from '../../utils/date';
import { EventBook } from './EventBook';
import { EventPlaceAndHost } from './EventPlaceAndHost';
import * as Styled from './styles';

export const EventDetails = () => {
  const { eventId = '' } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [result, setResult] = useState<{ id: string; event: EventDetailsData | null } | null>(null);

  useEffect(() => {
    let ignore = false;

    getEventDetails(eventId)
      .then((data) => {
        if (!ignore) setResult({ id: eventId, event: data });
      })
      .catch((err) => {
        console.error(err);
        if (!ignore) setResult({ id: eventId, event: null });
      });

    return () => {
      ignore = true;
    };
  }, [eventId]);

  const loading = result?.id !== eventId;
  const event = result?.event ?? null;

  if (loading) return <p>{locale.event_details.loading}</p>;
  if (!event) {
    return (
      <NotFound
        fullScreen={false}
        title={locale.event_details.notFoundTitle}
        description={locale.event_details.notFoundDescription}
      />
    );
  }

  const groupPath = `/grupos/${event.group.id}`;

  // seções sem `content` mostram "Em breve"; o conteúdo de cada uma entra nas issues 204 e 207
  const sections: { key: string; title: string; content?: ReactNode }[] = [
    { key: 'participation', title: locale.event_details.sections.participation },
    {
      key: 'book',
      title: locale.event_details.sections.book,
      content: <EventBook book={event.book} />,
    },
    {
      key: 'placeAndHost',
      title: locale.event_details.sections.placeAndHost,
      content: <EventPlaceAndHost location={event.location} host={event.host} />,
    },
    { key: 'photos', title: locale.event_details.sections.photos },
  ];

  // 'default' = primeira entrada do histórico (link aberto direto): não há para onde voltar
  const handleBack = () => {
    if (location.key === 'default') navigate(groupPath);
    else navigate(-1);
  };

  return (
    <Styled.Container>
      <BackButton label={locale.event_details.back} onClick={handleBack} />

      <Styled.Header>
        <Styled.HeaderInfo>
          <Styled.Title>{event.group.name}</Styled.Title>
          <Styled.Subtitle>
            {interpolate(locale.event_details.header.subtitle, {
              city: event.group.city,
              dateTime: formatEventDateTime(event.startsAt),
            })}
          </Styled.Subtitle>
        </Styled.HeaderInfo>

        <Button size="sm" variant="secondary" onClick={() => navigate(groupPath)}>
          {locale.event_details.groupLink}
        </Button>
      </Styled.Header>

      <Styled.Sections>
        {sections.map(({ key, title, content }) => (
          <Styled.Section
            key={key}
            $filled={Boolean(content)}
            aria-labelledby={`event-section-${key}`}
          >
            <Styled.SectionTitle id={`event-section-${key}`}>{title}</Styled.SectionTitle>
            {content ?? <Styled.ComingSoon>{locale.event_details.comingSoon}</Styled.ComingSoon>}
          </Styled.Section>
        ))}
      </Styled.Sections>
    </Styled.Container>
  );
};
