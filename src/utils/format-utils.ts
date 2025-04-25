
export const formatNumberInput = (value: string, isPercentage: boolean = true) => {
  if (!value) return isPercentage ? "0,00%" : "0,00";
  
  // Remove non-numeric characters except for comma and period
  let numValue = value.replace(/[^\d,.]/g, '');
  if (!numValue) return isPercentage ? "0,00%" : "0,00";
  
  // If the value already has a formatted appearance, extract just the number
  if (numValue.includes('.') && numValue.includes(',')) {
    numValue = numValue.replace(/\./g, '').replace(',', '.');
  } else {
    // Handle comma as decimal separator for direct user input
    numValue = numValue.replace(',', '.');
  }
  
  const number = parseFloat(numValue);
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
  let numValue = value.replace(/[^\d,.]/g, '');
  if (!numValue) return "R$ 0,00";
  
  // If the value already has a formatted appearance, extract just the number
  if (numValue.includes('.') && numValue.includes(',')) {
    numValue = numValue.replace(/\./g, '').replace(',', '.');
  } else {
    // Handle comma as decimal separator for direct user input
    numValue = numValue.replace(',', '.');
  }
  
  const number = parseFloat(numValue);
  if (isNaN(number)) return "R$ 0,00";
  
  // Format with Brazilian locale (comma as decimal separator, period as thousand separator)
  return "R$ " + number.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const parseCurrencyInput = (value: string): number => {
  // Remove currency symbol, dots and convert comma to dot
  if (!value) return 0;
  return Number(value.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.'));
};

export const parsePercentageInput = (value: string): number => {
  // Remove percentage symbol and convert comma to dot
  if (!value) return 0;
  return Number(value.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.'));
};

// New helper to handle raw user input without auto-formatting issues
export const handleNumericInput = (
  value: string, 
  currentValue: number, 
  isPercentage: boolean = true
): number => {
  // Handle empty input
  if (!value || value === '' || value === ',' || value === '.') {
    return 0;
  }
  
  // Remove any non-numeric characters except comma and dot
  let cleanValue = value.replace(/[^0-9,.]/g, '');
  
  // Replace comma with dot for parsing
  cleanValue = cleanValue.replace(',', '.');
  
  // Parse the value
  let parsedValue = parseFloat(cleanValue);
  
  // Return the parsed value or the current value if parsing fails
  return isNaN(parsedValue) ? currentValue : parsedValue;
};
