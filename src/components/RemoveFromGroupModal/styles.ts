import styled from 'styled-components';
import { enter } from '../../theme/motion';
import { theme } from '../../theme/theme';

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const KeepList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin: 0;
  padding: 0.875rem 1rem;
  border-radius: 0.75rem;
  background-color: ${theme.backgroundSubtle};
  color: ${theme.text};
  font-size: 0.875rem;
  line-height: 1.25rem;
  list-style: none;

  li {
    display: flex;
    align-items: flex-start;
    gap: 0.625rem;
  }

  svg {
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
    margin-top: 0.125rem;
    color: ${theme.successDark};
    stroke-width: 3;
  }
`;

export const Warning = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 0.75rem;
  background-color: ${theme.warningLight};
  ${enter(120)}
`;

export const WarningText = styled.p`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin: 0;
  color: ${theme.warningDark};
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.25rem;

  svg {
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
    margin-top: 0.125rem;
  }
`;

export const Error = styled.p`
  margin: 0;
  color: ${theme.error};
  font-size: 0.875rem;
  line-height: 1.25rem;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;
