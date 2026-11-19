import styled from 'styled-components';

export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const ZonesSection = styled.fieldset`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  border: 0;
  min-width: 0;
`;

export const ZonesTitle = styled.legend`
  padding: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

export const ZonesDescription = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.textMuted};
`;

export const ZoneList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const ZoneRow = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;

  & > div:first-child {
    flex: 1;
    min-width: 0;
    margin: 0;
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
`;

export const ZoneActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  flex-shrink: 0;
`;

export const ZoneHint = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.textMuted};
`;

export const EmptyZones = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.textMuted};
`;

export const AddZone = styled.div`
  display: flex;
`;

export const ErrorMessage = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.error};
`;
