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

export const Section = styled.section<{ $filled?: boolean }>`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  min-height: 10rem;
  padding: 1.25rem;
  background: ${theme.surface};
  border: 1px
    ${({ $filled }) => ($filled ? `solid ${theme.border}` : `dashed ${theme.borderStrong}`)};
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

export const BookRow = styled.div`
  width: 100%;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const bookCover = `
  flex: 0 0 4.5rem;
  width: 4.5rem;
  height: 6.5rem;
  border: 1px solid ${theme.border};
  border-radius: 0.375rem;
  background: ${theme.surfaceSunken};
`;

export const BookCover = styled.img`
  ${bookCover}
  object-fit: cover;
`;

export const BookCoverPlaceholder = styled.div`
  ${bookCover}
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.textMuted};

  svg {
    width: 1.75rem;
    height: 1.75rem;
  }
`;

export const BookInfo = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const BookTitle = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: ${theme.text};
  overflow-wrap: anywhere;
`;

export const BookAuthor = styled.span`
  font-size: 0.875rem;
  color: ${theme.textMuted};
  overflow-wrap: anywhere;
`;

export const BookEmpty = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${theme.text};
`;
