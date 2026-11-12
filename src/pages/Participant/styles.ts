import styled, { css } from 'styled-components';
import { Button } from '../../components/Button';
import { MOBILE_QUERY } from '../../layouts/DefaultLayout/styles';
import { EASE_OUT, enter, pop, pulse, reducedMotion } from '../../theme/motion';
import { theme } from '../../theme/theme';

const entrance = ({ $enter }: { $enter?: number }) => ($enter === undefined ? '' : enter($enter));

const surfaceCard = css`
  border: 1px solid ${theme.border};
  border-radius: 0.875rem;
  background-color: ${theme.surface};
`;

const pill = css`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.125rem 0.625rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 800;
  line-height: 1.125rem;
  white-space: nowrap;
`;

export type PillTone = 'success' | 'neutral' | 'brand' | 'warning' | 'danger';

const PILL_COLORS: Record<PillTone, { background: string; color: string }> = {
  success: { background: theme.successLight, color: theme.successDark },
  neutral: { background: theme.surfaceSunken, color: theme.text },
  brand: { background: theme.surfaceBrandSoft, color: theme.textBrand },
  warning: { background: theme.warningLight, color: theme.warningDark },
  danger: { background: theme.errorLight, color: theme.errorDark },
};

export const Page = styled.div`
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Columns = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 1.5rem;
`;

export const ProfileCard = styled.aside<{ $enter?: number }>`
  ${surfaceCard}
  flex: 1 1 18.75rem;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.75rem 1.5rem;
  border-radius: 1rem;
  ${entrance}

  @media ${MOBILE_QUERY} {
    padding: 1.25rem;
  }
`;

export const MainColumn = styled.div`
  flex: 999 1 32.5rem;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Identity = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.875rem;
`;

export const AvatarRing = styled.span<{ $active: boolean }>`
  position: relative;
  display: inline-flex;
  padding: 0.1875rem;
  border: 2px solid ${({ $active }) => ($active ? theme.borderBrand : theme.border)};
  border-radius: 50%;
  transition: border-color 0.3s ease;
  ${pop(80)}
`;

export const AvatarStatus = styled.span<{ $active: boolean }>`
  position: absolute;
  right: 0.125rem;
  bottom: 0.125rem;
  width: 0.875rem;
  height: 0.875rem;
  border: 2px solid ${theme.surface};
  border-radius: 50%;
  background-color: ${({ $active }) => ($active ? theme.success : theme.disabledFg)};
  transition: background-color 0.3s ease;

  ${({ $active }) =>
    $active &&
    css`
      &::after {
        content: '';
        position: absolute;
        inset: -2px;
        border-radius: 50%;
        background-color: ${theme.success};
        animation: ${pulse} 2.4s ease-out infinite;
        ${reducedMotion}
      }
    `}
`;

export const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
`;

export const Name = styled.h1`
  margin: 0;
  color: ${theme.text};
  font-size: 1.625rem;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
  overflow-wrap: anywhere;
`;

export const Subline = styled.span`
  color: ${theme.textMuted};
  font-size: 0.9375rem;
`;

export const Pills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const Pill = styled.span<{ $tone: PillTone }>`
  ${pill}
  background-color: ${({ $tone }) => PILL_COLORS[$tone].background};
  color: ${({ $tone }) => PILL_COLORS[$tone].color};
`;

export const StatusPill = styled(Pill)`
  padding: 0.25rem 0.625rem;
  font-size: 0.8125rem;
  ${pop(160)}
`;

export const Dot = styled.span`
  width: 0.4375rem;
  height: 0.4375rem;
  border-radius: 50%;
  background-color: currentColor;
`;

export const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;

  & > button {
    width: 100%;
    padding: 0.5rem 1rem;
  }
`;

export const NeutralButton = styled(Button)`
  && {
    border-color: ${theme.borderStrong};
    background-color: ${theme.surface};
    color: ${theme.text};
  }

  &&:hover:not(:disabled) {
    background-color: ${theme.surfaceSunken};
  }
`;

export const StatusError = styled.p`
  margin: -0.75rem 0 0;
  color: ${theme.error};
  font-size: 0.8125rem;
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1.25rem;
  border-top: 1px solid ${theme.border};
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: ${theme.textMuted};
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.04em;
`;

export const ContactList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const ContactIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background-color: ${theme.surfaceSunken};
  color: ${theme.text};
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ${EASE_OUT};

  svg {
    width: 1rem;
    height: 1rem;
  }

  ${reducedMotion}
`;

export const ContactLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  color: ${theme.text};
  font-size: 0.9375rem;
  font-weight: 600;
  text-decoration: none;

  & > span:last-child {
    overflow-wrap: anywhere;
  }

  &:hover {
    color: ${theme.textBrand};
  }

  &:hover ${ContactIcon} {
    background-color: ${theme.surfaceBrandSoft};
    color: ${theme.textBrand};
    transform: scale(1.06);
  }

  &:focus-visible {
    outline: 2px solid ${theme.focusRing};
    outline-offset: 0.25rem;
    border-radius: 0.25rem;
  }
`;

export const DetailsList = styled.dl`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.75rem 1rem;
  margin: 0;
  font-size: 0.875rem;

  dt {
    color: ${theme.textMuted};
    font-weight: 600;
  }

  dd {
    margin: 0;
    color: ${theme.text};
    font-weight: 700;
    text-align: right;
    overflow-wrap: anywhere;
  }
`;

export const StatsGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12.5rem, 1fr));
  gap: 1rem;
`;

export const StatCard = styled.div<{ $enter?: number }>`
  ${surfaceCard}
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
  padding: 1.25rem;
  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.25s ${EASE_OUT};
  ${entrance}

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

export const StatLabel = styled.span`
  color: ${theme.textMuted};
  font-size: 0.875rem;
  font-weight: 700;
`;

export const StatValue = styled.span`
  color: ${theme.text};
  font-size: 2.25rem;
  font-weight: 800;
  line-height: 1.1;
`;

export const StatSub = styled.span`
  color: ${theme.textMuted};
  font-size: 0.8125rem;
`;

export const PresenceDots = styled.span`
  display: flex;
  gap: 0.375rem;
`;

export const PresenceDot = styled.span<{ $present: boolean; $index: number }>`
  display: block;
  width: 0.875rem;
  height: 0.875rem;
  border: 2px solid ${({ $present }) => ($present ? theme.primary : theme.borderStrong)};
  border-radius: 50%;
  background-color: ${({ $present }) => ($present ? theme.primary : 'transparent')};
  ${({ $index }) => pop(200 + $index * 90)}
`;

export const Card = styled.section<{ $enter?: number }>`
  ${surfaceCard}
  min-width: 0;
  ${entrance}
`;

export const CardHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
`;

export const CardTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  color: ${theme.text};
  font-size: 1.125rem;
  font-weight: 800;
`;

export const Count = styled.span`
  ${pill}
  padding: 0.0625rem 0.5rem;
  background-color: ${theme.surfaceSunken};
  color: ${theme.text};
`;

export const TableArea = styled.div`
  position: relative;
  min-width: 0;
  padding: 0 1.25rem 0.25rem;

  table {
    min-width: 36rem;
  }

  @media ${MOBILE_QUERY} {
    padding: 0 0.75rem 0.25rem;
  }
`;

export const GroupName = styled.span`
  color: ${theme.text};
  font-weight: 800;
`;

export const EntryDate = styled.span<{ $missing?: boolean }>`
  color: ${({ $missing }) => ($missing ? theme.textMuted : theme.text)};
  font-weight: 600;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2.25rem 1.25rem;
  border-top: 1px solid ${theme.border};
  text-align: center;

  strong {
    color: ${theme.text};
    font-size: 0.9375rem;
    font-weight: 800;
  }

  span {
    color: ${theme.textMuted};
    font-size: 0.875rem;
  }
`;

export const MeetingList = styled.ul`
  margin: 0;
  padding: 0;
  border-top: 1px solid ${theme.border};
  list-style: none;
`;

export const MeetingItem = styled.li<{ $index: number }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1.25rem;
  transition: background-color 0.2s ease;
  ${({ $index }) => enter(260 + $index * 60)}

  & + & {
    border-top: 1px solid ${theme.border};
  }

  &:hover {
    background-color: ${theme.backgroundSubtle};
  }
`;

export const DateTile = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 3rem;
  padding: 0.375rem 0;
  border-radius: 0.625rem;
  background-color: ${theme.surfaceSunken};
  color: ${theme.text};
`;

export const DateTileDay = styled.span`
  font-size: 1.125rem;
  font-weight: 800;
  line-height: 1.1;
`;

export const DateTileMonth = styled.span`
  font-size: 0.6875rem;
  font-weight: 800;
  text-transform: uppercase;
`;

export const MeetingInfo = styled.span`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
`;

export const MeetingBook = styled.span`
  color: ${theme.text};
  font-weight: 800;
  overflow-wrap: anywhere;
`;

export const MeetingGroup = styled.span`
  color: ${theme.textMuted};
  font-size: 0.8125rem;
`;

export const Message = styled.p`
  margin: 0;
  padding: 1.5rem 1.25rem;
  border-top: 1px solid ${theme.border};
  color: ${theme.textMuted};
  font-size: 0.875rem;
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

export const CheckboxField = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${theme.text};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
`;

export const Checkbox = styled.input`
  width: 1.125rem;
  height: 1.125rem;
  margin: 0;
  accent-color: ${theme.primary};
  cursor: pointer;
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
  gap: 0.75rem;
  min-width: 0;
`;

export const SkeletonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
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
