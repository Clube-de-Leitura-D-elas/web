import styled, { css } from 'styled-components';
import { Button } from '../../components/Button';
import { MOBILE_QUERY } from '../../layouts/DefaultLayout/styles';
import { EASE_OUT, enter, growX, pop, pulse, reducedMotion } from '../../theme/motion';
import { theme } from '../../theme/theme';

const entrance = ({ $enter }: { $enter?: number }) => ($enter === undefined ? '' : enter($enter));

const surfaceCard = css`
  border: 1px solid ${theme.border};
  border-radius: 0.875rem;
  background-color: ${theme.surface};
`;

const hoverLift = css`
  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.25s ${EASE_OUT};

  &:hover {
    border-color: ${theme.borderStrong};
    box-shadow: 0 1rem 2rem -1.5rem ${theme.overlayScrim};
    transform: translateY(-0.125rem);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover {
      transform: none;
    }
  }
`;

const pill = css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 800;
  line-height: 1.125rem;
  white-space: nowrap;
`;

export const Container = styled.div`
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Header = styled.header<{ $enter?: number }>`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  ${entrance}
`;

export const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
`;

export const TitleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
`;

export const Title = styled.h1`
  margin: 0;
  color: ${theme.text};
  font-size: 1.875rem;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
  overflow-wrap: anywhere;

  @media ${MOBILE_QUERY} {
    font-size: 1.5rem;
  }
`;

export const StatusPill = styled.span<{ $active: boolean }>`
  ${pill}
  padding: 0.25rem 0.625rem;
  font-size: 0.8125rem;
  background-color: ${({ $active }) => ($active ? theme.successLight : theme.surfaceSunken)};
  color: ${({ $active }) => ($active ? theme.successDark : theme.text)};
  ${pop(180)}
`;

export const StatusDot = styled.span<{ $live?: boolean }>`
  position: relative;
  display: inline-block;
  flex-shrink: 0;
  width: 0.4375rem;
  height: 0.4375rem;
  border-radius: 50%;
  background-color: currentColor;

  ${({ $live }) =>
    $live &&
    css`
      &::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background-color: inherit;
        animation: ${pulse} 2s ease-out infinite;
        ${reducedMotion}
      }
    `}
`;

export const Subline = styled.p`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin: 0;
  color: ${theme.textMuted};
  font-size: 0.9375rem;

  svg {
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
  }
`;

export const NeutralButton = styled(Button)`
  && {
    padding: 0.5rem 1.25rem;
    border-color: ${theme.borderStrong};
    background-color: ${theme.surface};
    color: ${theme.text};
  }

  &&:hover:not(:disabled) {
    background-color: ${theme.surfaceSunken};
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  & > div > button {
    width: 2.5rem;
    height: 2.5rem;
    border: 1px solid ${theme.borderStrong};
    border-radius: 999px;
    background-color: ${theme.surface};
    color: ${theme.text};
  }
`;

export const SummaryStrip = styled.section<{ $enter?: number }>`
  ${surfaceCard}
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 0;
  padding: 0.875rem 0.5rem;
  ${entrance}
`;

export const SummaryItem = styled.div<{ $grow?: number }>`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex: ${({ $grow }) => $grow ?? 1} 1 13rem;
  min-width: 0;
  padding: 0 1.25rem;

  & + & {
    border-left: 1px solid ${theme.border};
  }

  @media ${MOBILE_QUERY} {
    flex-basis: 100%;

    & + & {
      border-left: none;
      padding-top: 0.75rem;
      border-top: 1px solid ${theme.border};
    }
  }
`;

export const SummaryIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.625rem;
  background-color: ${theme.surfaceSunken};
  color: ${theme.text};

  svg {
    width: 1.125rem;
    height: 1.125rem;
  }
`;

export const SummaryText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.0625rem;
  min-width: 0;
`;

export const SummaryLabel = styled.span`
  color: ${theme.textMuted};
  font-size: 0.75rem;
  font-weight: 700;
`;

export const SummaryValue = styled.span<{ $warning?: boolean }>`
  display: block;
  color: ${({ $warning }) => ($warning ? theme.warningDark : theme.text)};
  font-size: 0.9375rem;
  font-weight: 700;
  overflow-wrap: anywhere;
`;

export const SummaryDetail = styled.span`
  margin-left: 0.25rem;
  color: ${theme.textMuted};
  font-weight: 500;
`;

export const MeetingPill = styled.span<{ $confirmed: boolean }>`
  ${pill}
  margin-left: 0.5rem;
  vertical-align: 0.0625rem;
  background-color: ${({ $confirmed }) => ($confirmed ? theme.successLight : theme.warningLight)};
  color: ${({ $confirmed }) => ($confirmed ? theme.successDark : theme.warningDark)};
`;

export const StatsGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(13.5rem, 1fr));
  gap: 1rem;
`;

export const StatCard = styled.div<{ $enter?: number; $warning?: boolean }>`
  ${surfaceCard}
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
  padding: 1.25rem;
  ${({ $warning }) =>
    $warning &&
    css`
      border-color: ${theme.warningLight};
      background-color: ${theme.warningLight};
    `}
  ${entrance}
  ${hoverLift}
`;

export const StatLabel = styled.span<{ $warning?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: ${({ $warning }) => ($warning ? theme.warningDark : theme.textMuted)};
  font-size: 0.875rem;
  font-weight: ${({ $warning }) => ($warning ? 800 : 700)};

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

export const StatValue = styled.span`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  color: ${theme.text};
  font-size: 2.25rem;
  font-weight: 800;
  line-height: 1.1;

  & > svg {
    align-self: center;
    width: 1.5rem;
    height: 1.5rem;
    color: ${theme.warning};
    fill: ${theme.warning};
  }
`;

export const StatOf = styled.span`
  color: ${theme.textMuted};
  font-size: 1rem;
  font-weight: 600;
`;

export const StatSub = styled.span<{ $warning?: boolean }>`
  color: ${({ $warning }) => ($warning ? theme.warningDark : theme.textMuted)};
  font-size: 0.8125rem;
  line-height: 1.5;
`;

export const AttentionList = styled.ul`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  color: ${theme.warningDark};
  font-size: 0.8125rem;
  line-height: 1.5;
  list-style: none;
`;

export const Bar = styled.span`
  display: block;
  width: 100%;
  height: 0.375rem;
  overflow: hidden;
  border-radius: 999px;
  background-color: ${theme.surfaceSunken};
`;

export const BarFill = styled.span<{ $percent: number }>`
  display: block;
  width: ${({ $percent }) => `${$percent}%`};
  height: 100%;
  border-radius: inherit;
  background-color: ${theme.primary};
  transform-origin: left center;
  animation: ${growX} 0.9s ${EASE_OUT} 0.25s backwards;
  ${reducedMotion}
`;

export const TabsCard = styled.section<{ $enter?: number }>`
  ${surfaceCard}
  min-width: 0;
  padding: 0.25rem 1.25rem 0;
  ${entrance}

  @media ${MOBILE_QUERY} {
    padding: 0.25rem 0.75rem 0;
  }
`;

export const TabContent = styled.div`
  position: relative;
  min-width: 0;
  ${enter(0)}

  table {
    min-width: 50rem;
  }
`;

export const ParticipantCell = styled.span`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
`;

export const ParticipantInfo = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
  text-align: left;
`;

export const NameRow = styled.span`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 0.5rem;
`;

export const Name = styled.span`
  color: ${theme.text};
  font-size: 0.9375rem;
  font-weight: 700;
  overflow-wrap: anywhere;
`;

export const Email = styled.span<{ $missing?: boolean }>`
  color: ${({ $missing }) => ($missing ? theme.warningDark : theme.textMuted)};
  font-size: 0.8125rem;
  font-style: ${({ $missing }) => ($missing ? 'italic' : 'normal')};
  overflow-wrap: anywhere;
`;

export const Pill = styled.span<{ $tone: 'brand' | 'warning' }>`
  ${pill}
  background-color: ${({ $tone }) => ($tone === 'brand' ? theme.surfaceBrandSoft : theme.warningLight)};
  color: ${({ $tone }) => ($tone === 'brand' ? theme.textBrand : theme.warningDark)};
`;

export const EntryDate = styled.span<{ $missing?: boolean }>`
  color: ${({ $missing }) => ($missing ? theme.textMuted : theme.text)};
  font-weight: 600;
`;

export const Attendance = styled.span`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const Dots = styled.span`
  display: flex;
  gap: 0.3125rem;
`;

export const Dot = styled.span<{ $present: boolean; $index?: number }>`
  display: block;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  border: 2px solid ${({ $present }) => ($present ? theme.primary : theme.borderStrong)};
  background-color: ${({ $present }) => ($present ? theme.primary : 'transparent')};
  ${({ $index }) => ($index === undefined ? '' : pop(120 + $index * 90))}
`;

export const Percent = styled.span<{ $low: boolean }>`
  min-width: 2.5rem;
  color: ${({ $low }) => ($low ? theme.warningDark : theme.text)};
  font-weight: 800;
`;

export const Muted = styled.span`
  color: ${theme.textMuted};
  font-size: 0.8125rem;
`;

export const Legend = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.875rem;
  padding: 0 0 1rem;
  color: ${theme.textMuted};
  font-size: 0.8125rem;

  span {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }
`;

export const Stacked = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
  text-align: left;
`;

export const Strong = styled.span<{ $weight?: number }>`
  color: ${theme.text};
  font-weight: ${({ $weight }) => $weight ?? 700};
  overflow-wrap: anywhere;
`;

export const MeterRow = styled.span`
  display: flex;
  align-items: center;
  gap: 0.625rem;

  & > ${Bar} {
    width: 6rem;
  }
`;

export const Rating = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: ${theme.text};
  font-weight: 800;

  & > svg {
    width: 0.875rem;
    height: 0.875rem;
    color: ${theme.warning};
    fill: ${theme.warning};
  }
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 36rem) {
    grid-template-columns: 1fr;
  }
`;

export const ModalForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FormHint = styled.span`
  color: ${theme.textMuted};
  font-size: 0.75rem;
  line-height: 1rem;
`;

export const FormError = styled.p`
  margin: 0;
  color: ${theme.error};
  font-size: 0.875rem;
  line-height: 1.25rem;
`;

export const SkeletonStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  min-width: 0;
`;

export const SkeletonRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

export const SkeletonTable = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
`;

export const SkeletonTableRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid ${theme.border};
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
