import { useEffect, useEffectEvent, useId, useRef, type ReactNode } from 'react';
import { Button } from '../Button';
import * as Styled from './styles';

export type ModalSize = 'sm' | 'md' | 'lg';

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  onConfirm: () => void;
  confirmText: string;
  confirmDisabled?: boolean;
  size?: ModalSize;
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const INITIAL_FOCUS_SELECTOR = '[data-autofocus]';

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  onConfirm,
  confirmText,
  confirmDisabled = false,
  size = 'md',
}: ModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const handleClose = useEffectEvent(onClose);

  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const getFocusables = () =>
      Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

    const initialFocus =
      dialog.querySelector<HTMLElement>(INITIAL_FOCUS_SELECTOR) ?? getFocusables()[0];
    initialFocus?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusables = getFocusables();
      if (focusables.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (!dialog.contains(active)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Styled.Overlay onClick={onClose}>
      <Styled.Container
        ref={dialogRef}
        $size={size}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <Styled.Header>
          <Styled.Title id={titleId}>{title}</Styled.Title>
          <Styled.CloseButton type="button" onClick={onClose} aria-label="Fechar">
            ×
          </Styled.CloseButton>
        </Styled.Header>

        {description && <Styled.Description>{description}</Styled.Description>}

        {children && <Styled.Body>{children}</Styled.Body>}

        <Styled.Footer $size={size}>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={onConfirm} disabled={confirmDisabled}>
            {confirmText}
          </Button>
        </Styled.Footer>
      </Styled.Container>
    </Styled.Overlay>
  );
};
