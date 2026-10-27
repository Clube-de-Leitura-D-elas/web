import { useState } from 'react';
import { LuMapPin, LuUserRound } from 'react-icons/lu';
import { locale } from '../../locales';
import type { EventHost, EventLocation } from '../../types/event';
import * as Styled from './styles';

type EventPlaceAndHostProps = {
  location: EventLocation | null | undefined;
  host: EventHost | null | undefined;
};

export const EventPlaceAndHost = ({ location, host }: EventPlaceAndHostProps) => {
  // guarda a URL que falhou (e não um booleano): se a foto mudar, a nova URL volta a ser tentada
  const [failedPhotoUrl, setFailedPhotoUrl] = useState<string | null>(null);

  const text = locale.event_details.placeAndHost;
  const photoUrl = host?.photoUrl ?? null;

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
            <Styled.HostAvatar aria-hidden>
              {photoUrl && photoUrl !== failedPhotoUrl ? (
                <img
                  src={photoUrl}
                  alt=""
                  loading="lazy"
                  onError={() => setFailedPhotoUrl(photoUrl)}
                />
              ) : (
                <LuUserRound />
              )}
            </Styled.HostAvatar>

            <Styled.HostName>{host.name}</Styled.HostName>
          </Styled.HostLink>
        ) : (
          <Styled.PlaceHostEmpty>{text.hostEmpty}</Styled.PlaceHostEmpty>
        )}
      </Styled.PlaceHostItem>
    </Styled.PlaceHostList>
  );
};
