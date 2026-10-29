import styled from 'styled-components';

import { MOBILE_QUERY } from '../../layouts/DefaultLayout/styles';
import { theme } from '../../theme/theme';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-shrink: 0;
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

export const MonthTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.text};
  margin: 0;
  text-transform: capitalize;
  flex-shrink: 0;
`;

export const MonthNavigation = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  margin-bottom: 1rem;
  flex-shrink: 0;
`;

export const MonthNavigationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid ${theme.border};
  border-radius: 0.5rem;
  background-color: ${theme.surface};
  color: ${theme.text};
  font-size: 1.5rem;
  cursor: pointer;

  &:hover {
    background-color: ${theme.surfaceSunken};
  }

  &:focus-visible {
    outline: 2px solid ${theme.textBrand};
    outline-offset: 2px;
  }
`;

export const MonthNavigationButtons = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
`;

export const MonthSelector = styled.div`
  position: relative;
`;

export const MonthSelectorTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  background: transparent;
  color: ${theme.text};
  font: inherit;
  font-size: 1.25rem;
  font-weight: 700;
  text-transform: capitalize;
  cursor: pointer;

  &:hover {
    background-color: ${theme.surfaceSunken};
  }

  &:focus-visible {
    outline: 2px solid ${theme.textBrand};
    outline-offset: 2px;
  }
`;

export const MonthOptions = styled.div`
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  z-index: 20;
  width: 10rem;
  max-height: 15rem;
  overflow-y: auto;
  padding: 0.25rem;
  border: 1px solid ${theme.border};
  border-radius: 0.5rem;
  background: ${theme.surface};
  box-shadow: 0 4px 12px rgb(0 0 0 / 12%);
`;

export const MonthOption = styled.button<{ $isSelected: boolean }>`
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 0.25rem;
  background: ${({ $isSelected }) => ($isSelected ? theme.surfaceBrandSoft : 'transparent')};
  color: ${({ $isSelected }) => ($isSelected ? theme.textBrand : theme.text)};
  text-align: left;
  text-transform: capitalize;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background: ${theme.surfaceBrandSoft};
    color: ${theme.textBrand};
    outline: none;
  }
`;

export const YearInputContainer = styled.div`
  width: 6rem;
  flex: 0 0 6rem;
  display: flex;
  align-items: center;

  > div {
    width: 100%;
    max-width: none;
  }

  > div > label {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  input {
    text-align: center;
  }
`;

export const YearButton = styled.button`
  border: none;
  background: transparent;
  color: ${theme.text};
  font: inherit;
  font-size: 1.25rem;
  font-weight: 700;
  padding: 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;

  &:hover {
    background-color: ${theme.surfaceSunken};
  }

  &:focus-visible {
    outline: 2px solid ${theme.textBrand};
    outline-offset: 2px;
  }
`;

export const TodayButton = styled.button`
  padding: 0.5rem 0.875rem;
  border: 1px solid ${theme.border};
  border-radius: 0.5rem;
  background-color: ${theme.surface};
  color: ${theme.text};
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background-color: ${theme.surfaceSunken};
  }

  &:focus-visible {
    outline: 2px solid ${theme.textBrand};
    outline-offset: 2px;
  }
`;

export const MonthSeparator = styled.span`
  color: ${theme.text};
  font-size: 1.25rem;
  font-weight: 700;
`;

export const CalendarScroll = styled.div`
  width: 100%;
  flex: 1;
  min-height: 0;
  overflow-x: auto;
  overflow-y: hidden;
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  grid-template-rows: 44px repeat(var(--calendar-weeks), minmax(0, 1fr));
  width: 100%;
  height: 100%;
  min-width: 700px;
  border: 1px solid ${theme.border};
  border-radius: 0.75rem;
  overflow: hidden;
  box-sizing: border-box;
  background-color: ${theme.surface};
`;

export const WeekdayHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${theme.textMuted};
  border-bottom: 1px solid ${theme.border};
`;

export const DayCell = styled.div<{ $outsideMonth: boolean }>`
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;
  padding: 0.5rem;
  border-right: 1px solid ${theme.border};
  border-bottom: 1px solid ${theme.border};
  overflow: hidden;
  background-color: ${({ $outsideMonth }) => ($outsideMonth ? theme.surfaceSunken : theme.surface)};
  &:nth-child(7n) {
    border-right: none;
  }
`;

export const DayNumber = styled.span<{
  $today: boolean;
  $outsideMonth: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 0.875rem;
  font-weight: 600;

  color: ${({ $today, $outsideMonth }) =>
    $today ? theme.surface : $outsideMonth ? theme.textMuted : theme.text};

  background-color: ${({ $today }) => ($today ? theme.textBrand : 'transparent')};
`;

export const Feedback = styled.div`
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: ${theme.textMuted};
  flex-shrink: 0;
`;

export const EventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.375rem;
  min-width: 0;
  overflow: hidden;
`;

export const EventItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  min-width: 0;
  font-size: 0.75rem;
  color: ${theme.text};
`;

export const EventDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${theme.textBrand};
  flex-shrink: 0;
`;

export const EventText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
`;

export const MoreEvents = styled.span`
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${theme.textBrand};
`;
