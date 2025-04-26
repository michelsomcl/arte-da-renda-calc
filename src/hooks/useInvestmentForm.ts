
import { useState } from "react";
import { InvestmentFormData } from "@/types/investment";
import { formatPercentage, parseCurrencyInput, parsePercentageInput } from "@/utils/investment-utils";

export const useInvestmentForm = () => {
  const [formData, setFormData] = useState<InvestmentFormData>({
    investmentType: "CDB",
    modalityType: "pre-fixed",
    selicRate: 11.25,
    cdiRate: 11.15,
    ipcaRate: 4.5,
    preFixedRate: 12.0,
    startDate: new Date(),
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    principal: 1000,
  });

  const [inputs, setInputs] = useState({
    selicInput: formatPercentage(formData.selicRate),
    ipcaInput: formatPercentage(formData.ipcaRate),
    preFixedInput: formatPercentage(formData.preFixedRate || 0),
    cdiPercentageInput: formatPercentage(formData.cdiPercentage || 100),
    fixedRateInput: formatPercentage(formData.fixedRate || 0),
    principalInput: formData.principal.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    })
  });

  const handleSelicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setInputs(prev => ({ ...prev, selicInput: inputValue }));
    
    const numericValue = parsePercentageInput(inputValue);
    setFormData(prev => ({
      ...prev,
      selicRate: numericValue,
      cdiRate: Math.max(0, numericValue - 0.1),
    }));
  };

  const handleIpcaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setInputs(prev => ({ ...prev, ipcaInput: inputValue }));
    
    const numericValue = parsePercentageInput(inputValue);
    setFormData(prev => ({
      ...prev,
      ipcaRate: numericValue,
    }));
  };

  const handlePreFixedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setInputs(prev => ({ ...prev, preFixedInput: inputValue }));
    
    const numericValue = parsePercentageInput(inputValue);
    setFormData(prev => ({
      ...prev,
      preFixedRate: numericValue,
    }));
  };

  const handleCdiPercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setInputs(prev => ({ ...prev, cdiPercentageInput: inputValue }));
    
    const numericValue = parsePercentageInput(inputValue);
    setFormData(prev => ({
      ...prev,
      cdiPercentage: numericValue,
    }));
  };

  const handleFixedRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setInputs(prev => ({ ...prev, fixedRateInput: inputValue }));
    
    const numericValue = parsePercentageInput(inputValue);
    setFormData(prev => ({
      ...prev,
      fixedRate: numericValue,
    }));
  };

  const handlePrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setInputs(prev => ({ ...prev, principalInput: inputValue }));
    
    const numericValue = parseCurrencyInput(inputValue);
    setFormData(prev => ({
      ...prev,
      principal: numericValue,
    }));
  };

  const handleBlurPercentage = (
    e: React.FocusEvent<HTMLInputElement>, 
    setter: (value: string) => void, 
    value: number
  ) => {
    setter(formatPercentage(value));
  };

  const handleBlurCurrency = (e: React.FocusEvent<HTMLInputElement>) => {
    setInputs(prev => ({
      ...prev,
      principalInput: formData.principal.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
      })
    }));
  };

  return {
    formData,
    setFormData,
    inputs,
    handlers: {
      handleSelicChange,
      handleIpcaChange,
      handlePreFixedChange,
      handleCdiPercentageChange,
      handleFixedRateChange,
      handlePrincipalChange,
      handleBlurPercentage,
      handleBlurCurrency
    }
  };
};

