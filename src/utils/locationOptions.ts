type LocationOption = {
  id: string;
  name: string;
  isActive?: boolean;
};

export const toSelectableOptions = (options: LocationOption[], keepId: string | null) =>
  options
    .filter((option) => option.isActive !== false || option.id === keepId)
    .map(({ id, name }) => ({ value: id, label: name }));
