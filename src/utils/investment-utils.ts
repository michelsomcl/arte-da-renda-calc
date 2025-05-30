// Calculate business days between two dates
export const calculateBusinessDays = (startDate: Date, endDate: Date): number => {
  let count = 0;
  const curDate = new Date(startDate.getTime());
  
  while (curDate <= endDate) {
    const dayOfWeek = curDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    curDate.setDate(curDate.getDate() + 1);
  }
  
  return count;
};

// Calculate total days between two dates
export const calculateTotalDays = (startDate: Date, endDate: Date): number => {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Calculate months between two dates (for chart)
export const getMonthsBetweenDates = (startDate: Date, endDate: Date): Date[] => {
  const months: Date[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    months.push(new Date(currentDate));
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  return months;
};

// Format currency values
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL'
  }).format(value);
};

// Format percentage values with proper pt-BR localization
export const formatPercentage = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).replace('.', ',') + '%';
};

// Parse currency input
export const parseCurrencyInput = (input: string): number => {
  // Remove currency symbol and any thousand separators, then replace comma with dot
  const cleanedInput = input.replace(/[R$\s.]/g, '').replace(',', '.');
  const parsedValue = parseFloat(cleanedInput);
  return isNaN(parsedValue) ? 0 : parsedValue;
};

// Parse percentage input with proper pt-BR localization
export const parsePercentageInput = (input: string): number => {
  // Remove percentage symbol and any thousand separators, then replace ALL commas with dots
  const cleanedInput = input.replace(/[%]/g, '').replace(/\./g, '').replace(/,/g, '.');
  const parsedValue = parseFloat(cleanedInput);
  return isNaN(parsedValue) ? 0 : parsedValue;
};

// Calculate IR tax based on investment period and type
export const calculateIRTax = (days: number, investmentType: string): number => {
  // No IR tax for LCD, LCI, and LCA
  if (['LCD', 'LCI', 'LCA'].includes(investmentType)) {
    return 0;
  }
  
  if (days <= 180) return 0.225;       // 22.5%
  if (days <= 360) return 0.20;        // 20%
  if (days <= 720) return 0.175;       // 17.5%
  return 0.15;                         // 15%
};

// Calculate IOF tax based on investment period and type
export const calculateIOFTax = (days: number, investmentType: string): number => {
  // No IOF tax for LCD, LCI, and LCA
  if (['LCD', 'LCI', 'LCA'].includes(investmentType)) {
    return 0;
  }
  
  if (days >= 30) return 0;
  
  // IOF tax table (percentage decreases with days)
  const iofTable = [
    0.96, 0.93, 0.90, 0.86, 0.83, 0.80, 0.76, 0.73, 0.70, 0.66,
    0.63, 0.60, 0.56, 0.53, 0.50, 0.46, 0.43, 0.40, 0.36, 0.33,
    0.30, 0.26, 0.23, 0.20, 0.16, 0.13, 0.10, 0.06, 0.03, 0.00
  ];
  
  return iofTable[days - 1] || 0;
};

// Calculate pre-fixed investment returns
export const calculatePreFixedReturns = (
  principal: number,
  annualRate: number, // as percentage (e.g., 12.5 for 12.5%)
  days: number
): number => {
  // Convert annual rate to daily rate
  const dailyRate = Math.pow(1 + annualRate / 100, 1 / 252) - 1;
  // Calculate final amount
  return principal * Math.pow(1 + dailyRate, days);
};

// Calculate post-fixed (CDI) investment returns
export const calculatePostFixedReturns = (
  principal: number,
  cdiRate: number, // annual CDI rate as percentage
  cdiPercentage: number, // percentage of CDI (e.g., 110 for 110% of CDI)
  days: number
): number => {
  // Convert CDI to daily rate
  const dailyCdi = Math.pow(1 + cdiRate / 100, 1 / 252) - 1;
  // Apply CDI percentage
  const effectiveDailyRate = dailyCdi * (cdiPercentage / 100);
  // Calculate final amount
  return principal * Math.pow(1 + effectiveDailyRate, days);
};

// Calculate IPCA+ investment returns
export const calculateIPCAReturns = (
  principal: number,
  ipcaRate: number, // annual IPCA rate as percentage
  fixedRate: number, // fixed rate on top of IPCA
  days: number
): number => {
  // Sum IPCA and fixed rate first (this is the change)
  const combinedRate = ipcaRate + fixedRate;
  
  // Convert combined annual rate to the period rate
  const periodRate = Math.pow(1 + combinedRate / 100, days / 365) - 1;
  
  // Calculate final amount using combined rate
  return principal * (1 + periodRate);
};

// Data for the investment growth chart
export interface ChartDataPoint {
  date: Date;
  principal: number;
  accumulated: number;
}

// Generate chart data for investment growth
export const generateChartData = (
  startDate: Date,
  endDate: Date,
  principal: number,
  modalityType: string,
  params: {
    preFixedRate?: number;
    cdiRate?: number;
    cdiPercentage?: number;
    ipcaRate?: number;
    fixedRate?: number;
  }
): ChartDataPoint[] => {
  const months = getMonthsBetweenDates(startDate, endDate);
  const chartData: ChartDataPoint[] = [];

  months.forEach((date) => {
    const days = calculateBusinessDays(startDate, date);
    let accumulated = principal;

    switch (modalityType) {
      case 'pre-fixed':
        accumulated = calculatePreFixedReturns(
          principal,
          params.preFixedRate || 0,
          days
        );
        break;
      case 'post-fixed':
        accumulated = calculatePostFixedReturns(
          principal,
          params.cdiRate || 0,
          params.cdiPercentage || 100,
          days
        );
        break;
      case 'ipca':
        accumulated = calculateIPCAReturns(
          principal,
          params.ipcaRate || 0,
          params.fixedRate || 0,
          days
        );
        break;
    }

    chartData.push({
      date,
      principal,
      accumulated,
    });
  });

  return chartData;
};
