import styled from 'styled-components';
import { Button } from '../../components/Button';
import { MOBILE_QUERY, TABLET_QUERY } from '../../layouts/DefaultLayout/styles';

export const Container = styled.div`
  display: flex;
  min-height: 100vh;
  min-height: 100dvh;
`;

export const BrandPanel = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  padding: 4rem;
  background-color: ${({ theme }) => theme.textBrand};
  color: ${({ theme }) => theme.textOnBrand};
  text-align: center;

  @media ${TABLET_QUERY} {
    padding: 2rem;
  }

  @media ${MOBILE_QUERY} {
    display: none;
  }
`;

export const Logo = styled.img`
  width: 7.5rem;
  height: 7.5rem;
  border-radius: 50%;
  object-fit: cover;
  background-color: ${({ theme }) => theme.surface};
`;

export const BrandText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const BrandName = styled.p`
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 3rem;

  @media ${TABLET_QUERY} {
    font-size: 2rem;
    line-height: 2.5rem;
  }
`;

export const BrandSubtitle = styled.p`
  margin: 0;
  font-size: 1.125rem;
  line-height: 1.75rem;
`;

export const FormPanel = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: ${({ theme }) => theme.backgroundSubtle};

  @media ${MOBILE_QUERY} {
    padding: 1.5rem 1rem;
    background-color: ${({ theme }) => theme.background};
  }
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  max-width: 27.5rem;
  padding: 2.5rem;
  border-radius: 1rem;
  background-color: ${({ theme }) => theme.surface};
  box-shadow: 0 0.75rem 2rem rgba(0, 0, 0, 0.25); // a sombra tem essa cor pois não tem token de elevação

  @media ${MOBILE_QUERY} {
    max-width: 20rem;
    padding: 0;
    border-radius: 0;
    box-shadow: none;
  }
`;

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  max-width: 20rem;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  line-height: 2.5rem;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.text};

  @media ${MOBILE_QUERY} {
    font-size: 1.75rem;
    line-height: 2.25rem;
  }
`;

export const Subtitle = styled.p`
  margin: 0;
  font-size: 1rem;
  line-height: 1.5rem;
  color: ${({ theme }) => theme.textMuted};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 20rem;
`;

export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const ErrorMessage = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.25rem;
  text-align: center;
  color: ${({ theme }) => theme.error};
`;

export const SubmitButton = styled(Button)`
  width: 100%;
`;
