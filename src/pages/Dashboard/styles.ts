import styled from 'styled-components';
import { MOBILE_QUERY, TABLET_QUERY } from '../../layouts/DefaultLayout/styles';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};

  @media ${MOBILE_QUERY} {
    font-size: 1.5rem;
  }
`;

export const Subtitle = styled.p`
  margin: 0;
  font-size: 1rem;
  color: ${({ theme }) => theme.textMuted};
`;

export const KpiGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
`;
export const Icon = styled.span`
  display: flex;
  align-items: center;
  transform: translateY(2px);
`;

export const ChartsGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media ${TABLET_QUERY} {
    grid-template-columns: minmax(0, 1fr);
  }
`;

// O Recharts posiciona o canto do tooltip no ponto da barra; o translate o centraliza acima dele.
export const TooltipBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  transform: translate(-50%, -100%);
  white-space: nowrap;
  pointer-events: none;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.surface};
`;

export const TooltipTitle = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.textMuted};
`;

export const TooltipValue = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`;
