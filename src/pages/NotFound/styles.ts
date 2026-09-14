import styled, { css } from 'styled-components';

export const Container = styled.div<{ $fullScreen: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  width: 100%;
  min-height: ${({ $fullScreen }) => ($fullScreen ? '100vh' : '100%')};
  min-height: ${({ $fullScreen }) => ($fullScreen ? '100dvh' : '100%')};
  padding: 2rem 1.5rem;
  text-align: center;

  ${({ theme }) => css`
    background-color: ${theme.background};
  `}

  @media (max-width: 767px) {
    padding: 1.5rem 1rem;
  }
`;

export const Logo = styled.img`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  object-fit: cover;
`;

export const Code = styled.p`
  margin: 0;
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1;
  color: ${({ theme }) => theme.textBrand};

  @media (max-width: 767px) {
    font-size: 2.5rem;
  }
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};

  @media (max-width: 767px) {
    font-size: 1.25rem;
  }
`;

export const Description = styled.p`
  max-width: 28rem;
  margin: 0;
  font-size: 1rem;
  line-height: 1.5rem;
  color: ${({ theme }) => theme.textMuted};
`;

export const Actions = styled.div`
  margin-top: 0.5rem;
`;
