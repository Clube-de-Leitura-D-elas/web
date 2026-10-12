import { useId, useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { locale } from '../../locales';
import * as Styled from './styles';

export type AutocompleteOption = { value: string; label: string };

export type AutocompleteProps = {
  options: AutocompleteOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  id?: string;
  label: string;
  placeholder?: string;
  minCharacters?: number;
  noResultsText?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  maxSuggestions?: number;
};

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim();

export const Autocomplete = ({
  options,
  value,
  onChange,
  id,
  label,
  placeholder,
  minCharacters = 3,
  noResultsText = locale.autocomplete.noResults,
  helperText,
  error,
  disabled = false,
  required = false,
  maxSuggestions = 10,
}: AutocompleteProps) => {
  const generatedId = useId();
  const inputId = id ?? `${generatedId}-input`;
  const listId = `${inputId}-listbox`;
  const messageId = `${inputId}-message`;
  const selectedOption = options.find((option) => option.value === value);
  const [query, setQuery] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const text = query ?? selectedOption?.label ?? '';
  const canSearch = normalize(text).length >= minCharacters;

  const matches = useMemo(() => {
    if (!canSearch) return [];
    const normalizedQuery = normalize(text);
    return options
      .filter((option) => normalize(option.label).includes(normalizedQuery))
      .slice(0, maxSuggestions);
  }, [canSearch, maxSuggestions, options, text]);

  const showing = open && canSearch && !disabled;

  const select = (option: AutocompleteOption) => {
    onChange(option.value);
    setQuery(null);
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    setQuery(next);
    if (value !== null) onChange(null);
    setActiveIndex(-1);
    setOpen(true);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      if (open) {
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
        setActiveIndex(-1);
      }
      return;
    }

    if (!canSearch || !matches.length) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((previous) =>
        event.key === 'ArrowDown'
          ? (previous + 1) % matches.length
          : previous < 0
            ? matches.length - 1
            : (previous - 1 + matches.length) % matches.length,
      );
    } else if (event.key === 'Enter' && showing && activeIndex >= 0) {
      event.preventDefault();
      select(matches[activeIndex]);
    }
  };

  return (
    <Styled.Root
      ref={rootRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
          setActiveIndex(-1);
        }
      }}
    >
      <Styled.Label htmlFor={inputId}>{label}</Styled.Label>

      <Styled.Field $invalid={!!error} $disabled={disabled}>
        <Styled.TextField
          id={inputId}
          ref={inputRef}
          role="combobox"
          type="text"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={showing}
          aria-controls={showing ? listId : undefined}
          aria-activedescendant={
            showing && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined
          }
          aria-invalid={!!error}
          aria-describedby={error || helperText ? messageId : undefined}
          aria-required={required}
          value={text}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleInput}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
      </Styled.Field>

      {showing && (
        <Styled.Options id={listId} role="listbox" aria-label={label}>
          {matches.length ? (
            matches.map((option, index) => (
              <Styled.Option
                key={option.value}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                $active={index === activeIndex}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => select(option)}
              >
                {option.label}
              </Styled.Option>
            ))
          ) : (
            <Styled.NoResults role="status">{noResultsText}</Styled.NoResults>
          )}
        </Styled.Options>
      )}

      {(error || helperText) && (
        <Styled.Message id={messageId} $error={!!error}>
          {error ?? helperText}
        </Styled.Message>
      )}
    </Styled.Root>
  );
};
