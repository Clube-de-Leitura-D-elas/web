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
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  gap: 1rem;
`;

export const ChartsGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media ${TABLET_QUERY} {
    grid-template-columns: minmax(0, 1fr);
  }
`;

// O wrapper do tooltip começa no ponto e se estende para a direita (o translate só move a caixa
// visível): nos pontos finais ele passaria do card e abriria rolagem lateral na página.
export const ChartFrame = styled.div`
  overflow: hidden;
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

export const ZoomGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ZoomButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border-radius: 50%;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.textMuted};
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;

  svg {
    width: 1rem;
    height: 1rem;
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.borderBrand};
    background-color: ${({ theme }) => theme.surfaceBrandSoft};
    color: ${({ theme }) => theme.textBrand};
  }

  &:disabled {
    cursor: not-allowed;
    color: ${({ theme }) => theme.disabledFg};
    background-color: ${({ theme }) => theme.disabledBg};
  }
`;
