import styled from 'styled-components';

export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const ErrorMessage = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.error};
`;
