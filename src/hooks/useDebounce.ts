import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  // Campo esvaziado (ex.: "Limpar filtros") vale na hora, para não sair uma busca com o
  // texto antigo junto com os filtros já limpos.
  if (value === '' && debouncedValue !== '') {
    setDebouncedValue(value);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
