
export interface InvestmentFormData {
  investmentType: string;
  modalityType: string;
  selicRate: number;
  cdiRate: number;
  ipcaRate: number;
  preFixedRate?: number;
  cdiPercentage?: number;
  fixedRate?: number;
  startDate: Date;
  endDate: Date;
  principal: number;
}

