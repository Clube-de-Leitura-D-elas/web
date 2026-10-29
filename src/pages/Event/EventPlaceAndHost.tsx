import { LuMapPin } from 'react-icons/lu';
import { locale } from '../../locales';
import type { EventHost, EventLocation } from '../../types/event';
import { EventAvatar } from './EventAvatar';
import * as Styled from './styles';

type EventPlaceAndHostProps = {
  location: EventLocation | null | undefined;
  host: EventHost | null | undefined;
};

export const EventPlaceAndHost = ({ location, host }: EventPlaceAndHostProps) => {
  const text = locale.event_details.placeAndHost;

  return (
    <Styled.PlaceHostList>
      <Styled.PlaceHostItem>
        <Styled.PlaceHostLabel>{text.locationLabel}</Styled.PlaceHostLabel>

        {location ? (
          <Styled.PlaceRow>
            <Styled.PlaceIcon aria-hidden>
              <LuMapPin />
            </Styled.PlaceIcon>

            <Styled.PlaceInfo>
              <Styled.PlaceName>{location.name}</Styled.PlaceName>
              <Styled.PlaceAddress>{location.address || text.addressEmpty}</Styled.PlaceAddress>
            </Styled.PlaceInfo>
          </Styled.PlaceRow>
        ) : (
          <Styled.PlaceHostEmpty>{text.locationEmpty}</Styled.PlaceHostEmpty>
        )}
      </Styled.PlaceHostItem>

      <Styled.PlaceHostItem>
        <Styled.PlaceHostLabel>{text.hostLabel}</Styled.PlaceHostLabel>

        {host ? (
          <Styled.HostLink to={`/participantes/${host.id}`}>
            <EventAvatar photoUrl={host.photoUrl} size="md" />

            <Styled.HostName>{host.name}</Styled.HostName>
          </Styled.HostLink>
        ) : (
          <Styled.PlaceHostEmpty>{text.hostEmpty}</Styled.PlaceHostEmpty>
        )}
      </Styled.PlaceHostItem>
    </Styled.PlaceHostList>
  );
};
