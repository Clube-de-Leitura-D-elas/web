// Meses entre um rótulo e o próximo, do mais denso ao mais espaçado.
const STEPS = [1, 2, 3, 6, 12];
const MAX_LABELS = 8;

// Rótulos do eixo X contados do fim: o mês mais recente sempre aparece e os demais ficam a
// intervalos regulares (a cada 1, 2, 3, 6 ou 12 meses), com no máximo 8 rótulos.
export const pickTickLabels = (labels: string[]): string[] => {
  const step =
    STEPS.find((candidate) => Math.ceil(labels.length / candidate) <= MAX_LABELS) ??
    STEPS[STEPS.length - 1];

  const picked: string[] = [];
  for (let index = labels.length - 1; index >= 0; index -= step) picked.push(labels[index]);

  return picked.reverse();
};
