import styled from 'styled-components';
import { MOBILE_QUERY } from '../../layouts/DefaultLayout/styles';
import { theme } from '../../theme/theme';

export const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

export const Sections = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  gap: 1rem;
`;

export const Section = styled.section`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  min-height: 10rem;
  padding: 1.25rem;
  background: ${theme.surface};
  border: 1px dashed ${theme.borderStrong};
  border-radius: 0.75rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${theme.textMuted};
  margin: 0;
`;

export const ComingSoon = styled.span`
  padding: 0.2rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${theme.text};
  background: ${theme.surfaceSunken};
`;
