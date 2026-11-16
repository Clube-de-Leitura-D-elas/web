const numberFormatter = new Intl.NumberFormat('pt-BR');

// Número com separador de milhar em pt-BR (1.234). Use no lugar de escrever o número cru na tela.
export const formatNumber = (value: number) => numberFormatter.format(value);
