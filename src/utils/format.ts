const ratingFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export const formatRating = (value: number): string => ratingFormatter.format(value);

export const getFirstName = (name: string): string => name.trim().split(/\s+/)[0] ?? '';
