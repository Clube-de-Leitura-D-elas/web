import { useState } from 'react';
import * as Styled from './styles';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export type AvatarProps = {
  name: string;
  photo?: string | null;
  size?: AvatarSize;
};

const getInitials = (name: string) => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';

  const first = words[0].charAt(0);
  const last = words.length > 1 ? words[words.length - 1].charAt(0) : '';

  return `${first}${last}`.toLocaleUpperCase('pt-BR');
};

export const Avatar = ({ name, photo, size = 'md' }: AvatarProps) => {
  const [failedPhoto, setFailedPhoto] = useState<string | null>(null);
  const showPhoto = Boolean(photo) && photo !== failedPhoto;

  return (
    <Styled.Container $size={size} aria-hidden="true">
      {showPhoto ? (
        <img src={photo ?? undefined} alt="" onError={() => setFailedPhoto(photo ?? null)} />
      ) : (
        getInitials(name)
      )}
    </Styled.Container>
  );
};
