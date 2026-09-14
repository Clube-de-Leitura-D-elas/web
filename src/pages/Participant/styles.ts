import styled from 'styled-components';
import { theme } from '../../theme/theme';

export const Page = styled.div`
  width: 100%;
  min-width: 0;
`;

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  color: ${theme.text};
  cursor: pointer;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  &:hover {
    color: ${theme.textBrand};
  }

  &:focus-visible {
    outline: 2px solid ${theme.focusRing};
    outline-offset: 0.25rem;
    border-radius: 0.25rem;
  }
`;

export const PageTitle = styled.h1`
  margin: 0;
  color: ${theme.text};
  font-size: 2rem;
  font-weight: 700;
  line-height: 2.5rem;
`;

export const Card = styled.section`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  width: 100%;
  padding: 3rem;
  border-radius: 2rem;
  background-color: ${theme.surface};
`;

export const ProfileHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 2rem;
`;

export const ProfileArea = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  min-width: 0;
`;

export const Avatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 50%;
  background-color: ${theme.surfaceBrandSoft};
  color: ${theme.textBrand};

  svg {
    width: 3rem;
    height: 3rem;
  }
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-width: 0;
`;

export const ParticipantName = styled.h2`
  margin: 0;
  color: ${theme.text};
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5rem;
  text-transform: uppercase;
`;

export const StatusArea = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const StatusError = styled.span`
  color: ${theme.error};
  font-size: 0.75rem;
  line-height: 1rem;
`;

export const Contacts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
`;

export const ContactItem = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  color: ${theme.textMuted};
  font-size: 0.75rem;
  line-height: 1rem;
  text-decoration: none;

  svg {
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
  }

  span {
    overflow-wrap: anywhere;
  }

  &:hover {
    color: ${theme.textBrand};
  }

  &:focus-visible {
    outline: 2px solid ${theme.focusRing};
    outline-offset: 0.25rem;
    border-radius: 0.25rem;
  }
`;

export const TableArea = styled.div`
  width: 100%;
  min-width: 0;
`;

export const GroupNumber = styled.span`
  color: ${theme.text};
  font-weight: 600;
`;

export const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 2rem;
  width: 100%;

  @media (max-width: 75rem) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 48rem) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 36rem) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const Detail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
`;

export const DetailLabel = styled.span`
  color: ${theme.textMuted};
  font-size: 0.75rem;
  line-height: 1rem;
`;

export const DetailValue = styled.span`
  color: ${theme.text};
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
  overflow-wrap: anywhere;
`;

export const Presence = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

export const PresenceDot = styled.span<{
  $present: boolean;
}>`
  display: block;
  box-sizing: border-box;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  border: 2px solid ${({ $present }) => ($present ? theme.primary : theme.borderBrand)};
  background-color: ${({ $present }) => ($present ? theme.primary : 'transparent')};
`;

export const Message = styled.p<{
  $error?: boolean;
}>`
  margin: 0;
  color: ${({ $error }) => ($error ? theme.error : theme.textMuted)};
  font-size: 0.875rem;
  line-height: 1.25rem;
`;
