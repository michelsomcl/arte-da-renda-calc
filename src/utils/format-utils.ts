
export const formatNumberInput = (value: string, isPercentage: boolean = true) => {
  if (!value) return isPercentage ? "0,00%" : "0,00";
  
  // Remove non-numeric characters except for comma and period
  const numValue = value.replace(/[^\d,.]/g, '');
  if (!numValue) return isPercentage ? "0,00%" : "0,00";
  
  // Convert to number (replace comma with period for JS parsing)
  const normalized = numValue.replace(/\./g, '').replace(',', '.');
  const number = parseFloat(normalized);
  if (isNaN(number)) return isPercentage ? "0,00%" : "0,00";
  
  // Format with Brazilian locale (comma as decimal separator)
  return number.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + (isPercentage ? '%' : '');
};

export const formatCurrencyInput = (value: string) => {
  if (!value) return "R$ 0,00";
  
  // Remove non-numeric characters except for comma and period
  const numValue = value.replace(/[^\d,.]/g, '');
  if (!numValue) return "R$ 0,00";
  
  // Convert to number (replace comma with period for JS parsing)
  const normalized = numValue.replace(/\./g, '').replace(',', '.');
  const number = parseFloat(normalized);
  if (isNaN(number)) return "R$ 0,00";
  
  // Format with Brazilian locale (comma as decimal separator, period as thousand separator)
  return "R$ " + number.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const parseCurrencyInput = (value: string): number => {
  // Remove currency symbol, dots and convert comma to dot
  return Number(value.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.'));
};

export const parsePercentageInput = (value: string): number => {
  // Remove percentage symbol and convert comma to dot
  return Number(value.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.'));
};
