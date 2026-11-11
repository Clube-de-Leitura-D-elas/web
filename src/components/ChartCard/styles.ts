import styled from 'styled-components';

export const Card = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
  box-sizing: border-box;
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.surface};
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem 0.75rem;
`;

export const Action = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  min-width: 0;

  /* o Tabs ocupa 100% da largura por padrão: aqui cada item ocupa só o próprio tamanho */
  > div {
    width: auto;
  }

  /* abas mais justas: título, abas e lupas cabem na mesma linha em cards de ~700px */
  [role='tab'] {
    padding: 0 0.75rem;
  }
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.textMuted};
`;
