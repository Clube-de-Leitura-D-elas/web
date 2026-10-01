import { Link } from 'react-router';
import styled from 'styled-components';
import { MOBILE_QUERY } from '../../layouts/DefaultLayout/styles';
import { theme } from '../../theme/theme';
import { Button } from '../../components/Button';

const focusRing = `
  &:focus-visible {
    outline: 2px solid ${theme.focusRing};
    outline-offset: 0.25rem;
    border-radius: 0.25rem;
  }
`;

export const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Message = styled.p`
  padding: 3rem 1rem;
  text-align: center;
  color: ${theme.textMuted};
`;

export const BackButton = styled.button`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  border: none;
  background: none;
  color: ${theme.textBrand};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    color: ${theme.primaryHover};
  }

  ${focusRing}
`;

export const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${theme.text};
  margin: 0;

  @media ${MOBILE_QUERY} {
    font-size: 1.5rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1rem;
  color: ${theme.textMuted};
  margin: 0;
`;

export const CardsRow = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1rem;
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.35rem;
  padding: 1.25rem;
  background: ${theme.surface};
  border: 1px solid ${theme.border};
  border-radius: 0.75rem;
`;

export const CardLabel = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${theme.textMuted};
  margin: 0;
`;

export const CardValue = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: ${theme.text};
`;

export const CardText = styled.span`
  font-size: 0.85rem;
  color: ${theme.textMuted};
`;

export const MeetingStatus = styled.span<{ $confirmed: boolean }>`
  padding: 0.2rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ $confirmed }) => ($confirmed ? theme.textBrand : theme.textMuted)};
  background: ${({ $confirmed }) => ($confirmed ? theme.surfaceBrandSoft : theme.backgroundSubtle)};
`;

export const TableContainer = styled.div`
  background: ${theme.surface};
  border-radius: 0.75rem;
  overflow: hidden;
`;

export const ParticipantLink = styled(Link)`
  font-weight: 600;
  color: ${theme.text};
  text-decoration: none;

  &:hover {
    color: ${theme.textBrand};
    text-decoration: underline;
  }

  ${focusRing}
`;

export const AttendanceList = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.35rem;
`;

export const AttendanceMark = styled.span<{ $present: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  color: ${({ $present }) => ($present ? theme.textBrand : theme.textMuted)};
  background: ${({ $present }) => ($present ? theme.surfaceBrandSoft : theme.backgroundSubtle)};
`;

export const ActionsButton = styled.button`
  padding: 0.25rem 0.5rem;
  border: none;
  background: none;
  color: ${theme.textMuted};
  font-size: 1.1rem;
  cursor: pointer;

  &:hover {
    color: ${theme.text};
  }

  ${focusRing}
`;

export const NameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const Muted = styled.span`
  color: ${theme.textMuted};
`;

export const Rating = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 600;
  color: ${theme.text};

  & > svg {
    color: ${theme.warning};
    fill: ${theme.warning};
  }
`;
export const EditButton = styled(Button)`
  && {
    background-color: ${theme.surface};
    color: ${theme.text};
    border-color: ${theme.border};
  }

  &&:hover:not(:disabled) {
    background-color: ${theme.surfaceSunken};
  }
`;

export const CloseButton = styled(Button)`
  && {
    background-color: ${theme.surface};
    color: ${theme.danger};
    border-color: ${theme.danger};
  }

  &&:hover:not(:disabled) {
    background-color: ${theme.errorLight};
  }
`;
export const CoordinatorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
`;

export const Avatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  background: ${theme.surfaceBrandSoft};
  color: ${theme.textBrand};
  font-size: 0.85rem;
  font-weight: 700;
`;

export const CoordinatorInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  flex: 1;
  min-width: 0;
`;

export const TrocarButton = styled.button`
  flex-shrink: 0;
  padding: 0.4rem 1rem;
  border-radius: 999px;
  border: 1px solid ${theme.borderBrand};
  background: ${theme.surface};
  color: ${theme.textBrand};
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${theme.surfaceBrandSoft};
  }

  ${focusRing}
`;

export const CoordinatorTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  color: ${theme.textBrand};
  background: ${theme.surfaceBrandSoft};
`;

export const MeetingHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const MeetingBody = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  width: 100%;
`;

export const CalendarIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background: ${theme.backgroundSubtle};
  color: ${theme.textMuted};
  font-size: 1.1rem;
`;

export const MeetingInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

export const MeetingDate = styled.span`
  font-size: 1.05rem;
  font-weight: 700;
  color: ${theme.text};
`;

export const BookTitle = styled.span`
  font-weight: 700;
  color: ${theme.textBrand};
`;

export const LocationText = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.85rem;
  color: ${theme.textMuted};
`;
