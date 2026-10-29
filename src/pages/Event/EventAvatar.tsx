import { useState } from 'react';
import { LuUserRound } from 'react-icons/lu';
import * as Styled from './styles';

type EventAvatarProps = {
  photoUrl: string | null;
  // `md` na anfitriã, `sm` nas listas de participantes
  size?: 'md' | 'sm';
};

export const EventAvatar = ({ photoUrl, size = 'sm' }: EventAvatarProps) => {
  const Avatar = size === 'md' ? Styled.HostAvatar : Styled.ParticipantAvatar;

  // guarda a URL que falhou (e não um booleano): se a foto mudar, a nova URL volta a ser tentada
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  return (
    <Avatar aria-hidden>
      {photoUrl && photoUrl !== failedUrl ? (
        <img src={photoUrl} alt="" loading="lazy" onError={() => setFailedUrl(photoUrl)} />
      ) : (
        <LuUserRound />
      )}
    </Avatar>
  );
};
