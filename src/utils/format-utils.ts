
export const formatNumberInput = (value: string, isPercentage: boolean = true) => {
  const numValue = value.replace(/[^\d,]/g, '').replace(/\./g, '');
  if (!numValue) return '';
  
  const normalized = numValue.replace(',', '.');
  const number = parseFloat(normalized);
  if (isNaN(number)) return '';
  
  return number.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + (isPercentage ? '%' : '');
};
