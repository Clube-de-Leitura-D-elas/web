import { Link } from 'react-router';
import styled from 'styled-components';
import { MOBILE_QUERY } from '../../layouts/DefaultLayout/styles';
import { theme } from '../../theme/theme';

export const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
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

export const FiltersBar = styled.section`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  & > div:first-child {
    flex: 1;
    min-width: 16rem;
    margin: 0;

    @media ${MOBILE_QUERY} {
      width: 100%;
      min-width: 100%;
    }
  }

  & > div:first-child label {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @media ${MOBILE_QUERY} {
    flex-direction: column;
    align-items: stretch;

    & > * {
      width: 100% !important;
    }
  }
`;

export const FilterSlot = styled.div<{ $hidden: boolean }>`
  display: ${({ $hidden }) => ($hidden ? 'none' : 'contents')};
`;

export const SortButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  height: 2.75rem;
  padding: 0 1.25rem;
  border-radius: 9999px;
  border: 1px solid ${theme.border};
  background-color: ${theme.surface};
  color: ${theme.text};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: ${theme.background};
  }

  @media ${MOBILE_QUERY} {
    width: 100%;
  }
`;

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  /* Força a tabela a manter uma largura mínima legível */
  table {
    min-width: 650px;
  }
`;

export const ParticipantName = styled.span`
  font-weight: 600;
  color: ${theme.text};
  white-space: nowrap;
`;

export const ParticipantLink = styled(Link)`
  font-weight: 600;
  color: ${theme.text};
  white-space: nowrap;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const Contact = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ContactSecondary = styled.small`
  color: ${theme.textMuted};
`;

export const RequestActions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

export const AttendanceList = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

export const AttendanceBadge = styled.span<{ $type: 'P' | 'F' }>`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${({ $type }) =>
    $type === 'P' ? theme.surfaceBrandSoft : theme.surfaceSunken};
  color: ${({ $type }) => ($type === 'P' ? theme.textBrand : theme.textMuted)};
  flex-shrink: 0;
`;

export const StatusBadge = styled.span<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.875rem;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 500;
  white-space: nowrap;
  background-color: ${({ $active }) => ($active ? theme.successLight : theme.warningLight)};
  color: ${({ $active }) => ($active ? theme.successDark : theme.warningDark)};
`;

export const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  color: ${theme.textMuted};
  font-size: 1.25rem;
  line-height: 1;

  &:hover {
    color: ${theme.text};
  }
`;
