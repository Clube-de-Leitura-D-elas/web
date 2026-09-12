import { useEffect, useId, useRef, type ReactNode } from 'react';
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
  size?: ModalSize;
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  onConfirm,
  confirmText,
  size = 'md',
}: ModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    focusables?.[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusableElements.length === 0) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
          <Button variant="primary" onClick={onConfirm}>
            {confirmText}
          </Button>
        </Styled.Footer>
      </Styled.Container>
    </Styled.Overlay>
  );
};
