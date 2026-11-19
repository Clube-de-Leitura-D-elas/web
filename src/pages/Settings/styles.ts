import styled from 'styled-components';
import { MOBILE_QUERY } from '../../layouts/DefaultLayout/styles';

export const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin: 0;

  @media ${MOBILE_QUERY} {
    font-size: 1.5rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.textMuted};
  margin: 0;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 0.5rem;
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;

  @media ${MOBILE_QUERY} {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SectionSummary = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.textMuted};
  margin: 0;
`;

export const FiltersBar = styled.section`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  & > div:first-child {
    flex: 1;
    min-width: 16rem;
    margin: 0;

    @media ${MOBILE_QUERY} {
      width: 100%;
      min-width: 100%;
    }
  }

  & > div:first-child label {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @media ${MOBILE_QUERY} {
    flex-direction: column;
    align-items: stretch;

    & > * {
      width: 100% !important;
    }
  }
`;

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;

  & table {
    min-width: 44rem;
  }
`;

export const CityName = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

export const UfCode = styled.abbr`
  text-decoration: none;
  color: ${({ theme }) => theme.text};
`;

export const ZoneTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.375rem;
`;

export const Muted = styled.span`
  color: ${({ theme }) => theme.textMuted};
`;

export const VisuallyHidden = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
`;

export const PasswordForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  max-width: 28rem;
`;

export const FormActions = styled.div`
  display: flex;
`;

export const FormError = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.error};
`;
