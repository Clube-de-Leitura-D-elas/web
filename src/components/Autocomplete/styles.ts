import styled, { css } from 'styled-components';

export const Root = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

export const Label = styled.label`
  ${({ theme }) => css`
    color: ${theme.text};
  `}
  font-size: 0.875rem;
  font-weight: 700;
`;

export const Field = styled.div<{ $invalid: boolean; $disabled: boolean }>`
  ${({ theme, $invalid, $disabled }) => css`
    border: 0.0625rem solid ${$invalid ? theme.error : theme.border};
    background: ${$disabled ? theme.disabledBg : theme.surface};
    &:focus-within {
      border-color: ${$invalid ? theme.error : theme.focusRing};
    }
  `}
  height: 2.5rem;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  border-radius: 0.5rem;
`;

export const TextField = styled.input`
  ${({ theme }) => css`
    color: ${theme.text};
    &::placeholder {
      color: ${theme.textMuted};
    }
    &:disabled {
      color: ${theme.disabledFg};
    }
  `}
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  font: inherit;
  font-size: 0.875rem;
  &:focus-visible {
    outline: none;
  }
`;

export const Options = styled.div`
  ${({ theme }) => css`
    background: ${theme.surface};
    border: 0.0625rem solid ${theme.border};
  `}
  position: absolute;
  top: calc(100% - 0.25rem);
  left: 0;
  right: 0;
  z-index: 20;
  max-height: 15rem;
  overflow-y: auto;
  border-radius: 0.5rem;
  box-shadow: 0 0.25rem 0.75rem rgb(0 0 0 / 0.1);
`;

export const Option = styled.div<{ $active: boolean }>`
  ${({ theme, $active }) => css`
    color: ${theme.text};
    background: ${$active ? theme.surfaceBrandSoft : theme.surface};
    &:hover {
      background: ${theme.surfaceBrandSoft};
    }
  `}
  padding: 0.65rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
`;

export const NoResults = styled.div`
  ${({ theme }) => css`
    color: ${theme.textMuted};
  `}
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
`;

export const Message = styled.span<{ $error: boolean }>`
  ${({ theme, $error }) => css`
    color: ${$error ? theme.error : theme.textMuted};
  `}
  font-size: 0.75rem;
`;
