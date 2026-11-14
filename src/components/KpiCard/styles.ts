import styled from 'styled-components';
import { theme } from '../../theme/theme';

export const Card = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
  box-sizing: border-box;
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid ${theme.border};
  background-color: ${theme.surface};
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${theme.textMuted};
`;

export const Value = styled.span`
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  color: ${theme.text};
`;

export const Description = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: ${theme.textMuted};
`;
