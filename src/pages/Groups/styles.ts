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

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  table {
    min-width: 650px;
  }
`;

export const GroupInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const GroupName = styled.span`
  font-weight: 600;
  color: ${theme.text};
`;

export const GroupCreatedAt = styled.span`
  color: ${theme.textMuted};
  font-size: 0.75rem;
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
