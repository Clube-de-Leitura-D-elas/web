import { useEffect, useEffectEvent, useRef, useState, type ReactNode } from 'react';
import { LuChevronLeft, LuChevronRight, LuX } from 'react-icons/lu';
import { interpolate } from '../../locales';
import { useLocale } from '../../hooks/useLocale';
import * as Styled from './styles';

export type LightboxItem = {
  id: string;
  src: string;
  alt: string;
};

export type LightboxProps = {
  items: LightboxItem[];
  // posição da imagem aberta
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  // nome acessível do diálogo
  label: string;
  // avisa quando a imagem aberta não carrega (ex.: link vencido)
  onImageError?: (item: LightboxItem) => void;
  // informações e ações da imagem aberta (autor, data, botão de baixar)
  footer?: ReactNode;
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const Lightbox = ({
  items,
  index,
  onIndexChange,
  onClose,
  label,
  onImageError,
  footer,
}: LightboxProps) => {
  const locale = useLocale().lightbox;
  const dialogRef = useRef<HTMLDivElement>(null);
  const pressStartedOnOverlay = useRef(false);
  // guarda a URL que falhou (e não um booleano): com link novo, a imagem volta a ser tentada
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const item = items[index];
  const hasPrevious = index > 0;
  const hasNext = index < items.length - 1;

  const handleClose = useEffectEvent(onClose);
  const handleArrow = useEffectEvent((key: string) => {
    if (key === 'ArrowLeft' && hasPrevious) onIndexChange(index - 1);
    if (key === 'ArrowRight' && hasNext) onIndexChange(index + 1);
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement && !dialog.contains(document.activeElement)
        ? document.activeElement
        : null;
    const getFocusables = () =>
      Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

    getFocusables()[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
        return;
      }

      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        handleArrow(event.key);
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
  }, []);

  if (!item) return null;

  const failed = failedSrc === item.src;

  return (
    <Styled.Overlay
      onMouseDown={(event) => {
        pressStartedOnOverlay.current = event.target === event.currentTarget;
      }}
      onMouseUp={(event) => {
        if (event.target !== event.currentTarget) pressStartedOnOverlay.current = false;
      }}
      onClick={(event) => {
        if (pressStartedOnOverlay.current && event.target === event.currentTarget) onClose();
      }}
    >
      <Styled.Dialog ref={dialogRef} role="dialog" aria-modal="true" aria-label={label}>
        <Styled.CloseButton type="button" onClick={onClose} aria-label={locale.close}>
          <LuX aria-hidden />
        </Styled.CloseButton>

        <Styled.Stage>
          <Styled.NavButton
            type="button"
            onClick={() => onIndexChange(index - 1)}
            disabled={!hasPrevious}
            aria-label={locale.previous}
          >
            <LuChevronLeft aria-hidden />
          </Styled.NavButton>

          {failed ? (
            <Styled.Unavailable role="img" aria-label={item.alt}>
              {locale.unavailable}
            </Styled.Unavailable>
          ) : (
            <Styled.Image
              key={item.src}
              src={item.src}
              alt={item.alt}
              onError={() => {
                setFailedSrc(item.src);
                onImageError?.(item);
              }}
            />
          )}

          <Styled.NavButton
            type="button"
            onClick={() => onIndexChange(index + 1)}
            disabled={!hasNext}
            aria-label={locale.next}
          >
            <LuChevronRight aria-hidden />
          </Styled.NavButton>
        </Styled.Stage>

        <Styled.Footer>
          <Styled.Position>
            {interpolate(locale.position, { position: index + 1, total: items.length })}
          </Styled.Position>
          {footer}
        </Styled.Footer>
      </Styled.Dialog>
    </Styled.Overlay>
  );
};
