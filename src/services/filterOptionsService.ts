import type { DropdownItemList } from '../components/Dropdown';
import { supabase } from './supabaseClient';

export async function getCityOptions(): Promise<DropdownItemList[]> {
  const { data, error } = await supabase.from('cities').select('id, name').order('name');
  if (error) throw error;
  return [
    { value: '', label: 'Cidade: todas' },
    ...data.map((city) => ({ value: city.id, label: city.name })),
  ];
}

export async function getGroupOptions(): Promise<DropdownItemList[]> {
  const { data, error } = await supabase
    .from('groups')
    .select('id, number, description')
    .eq('active', true)
    .order('number');

  if (error) throw error;
  return [
    { value: '', label: 'Grupo: todos' },
    ...data.map((group) => ({
      value: group.id,
      label: `Grupo ${group.number} - ${group.description}`,
    })),
  ];
}
