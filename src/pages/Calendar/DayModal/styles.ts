import styled from 'styled-components';
import { theme } from '../../../theme/theme';

export const EventsList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const EventItem = styled.li`
  list-style: none;
`;

export const EventButton = styled.button`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem;
  border: 1px solid ${theme.border};
  border-radius: 0.5rem;
  background-color: ${theme.surface};
  text-align: left;
  font: inherit;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: ${theme.textBrand};
  }

  &:focus-visible {
    outline: 2px solid ${theme.textBrand};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: default;
  }
`;

export const EventDot = styled.span`
  width: 0.625rem;
  height: 0.625rem;
  margin-top: 0.375rem;
  flex-shrink: 0;
  border-radius: 50%;
  background-color: ${theme.textBrand};
`;

export const EventDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
`;

export const EventTime = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${theme.textBrand};
`;

export const GroupName = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${theme.text};
`;

export const City = styled.span`
  font-size: 0.8125rem;
  color: ${theme.textMuted};
`;

export const EmptyState = styled.p`
  margin: 0;
  padding: 1.5rem 1rem;
  text-align: center;
  font-size: 0.875rem;
  color: ${theme.textMuted};
`;
