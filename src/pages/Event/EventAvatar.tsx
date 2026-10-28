import { useState } from 'react';
import { LuUserRound } from 'react-icons/lu';
import * as Styled from './styles';

type EventAvatarProps = {
  photoUrl: string | null;
};

export const EventAvatar = ({ photoUrl }: EventAvatarProps) => {
  // guarda a URL que falhou (e não um booleano): se a foto mudar, a nova URL volta a ser tentada
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  return (
    <Styled.ParticipantAvatar aria-hidden>
      {photoUrl && photoUrl !== failedUrl ? (
        <img src={photoUrl} alt="" loading="lazy" onError={() => setFailedUrl(photoUrl)} />
      ) : (
        <LuUserRound />
      )}
    </Styled.ParticipantAvatar>
  );
};
