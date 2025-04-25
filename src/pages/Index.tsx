
import React, { useState } from "react";
import InvestmentForm, { InvestmentFormData } from "@/components/InvestmentForm";
import InvestmentResults from "@/components/InvestmentResults";
import {
  calculateBusinessDays,
  calculateTotalDays,
  calculateIRTax,
  calculateIOFTax,
  calculatePreFixedReturns,
  calculatePostFixedReturns,
  calculateIPCAReturns,
  generateChartData,
} from "@/utils/investment-utils";

const Index = () => {
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleCalculate = (formData: InvestmentFormData) => {
    // Calculate business days between start and end date
    const businessDays = calculateBusinessDays(
      formData.startDate, 
      formData.endDate
    );
    
    // Calculate total days between start and end date
    const days = calculateTotalDays(formData.startDate, formData.endDate);
    
    // Calculate IR tax rate based on days
    const irTaxRate = calculateIRTax(days);
    
    // Calculate IOF tax rate based on days
    const iofTaxRate = calculateIOFTax(days);
    
    // Calculate gross returns based on modality type
    let grossReturn = 0;
    
    switch (formData.modalityType) {
      case "pre-fixed":
        if (formData.preFixedRate) {
          grossReturn = calculatePreFixedReturns(
            formData.principal,
            formData.preFixedRate,
            businessDays
          );
        }
        break;
      case "post-fixed":
        if (formData.cdiPercentage) {
          grossReturn = calculatePostFixedReturns(
            formData.principal,
            formData.cdiRate,
            formData.cdiPercentage,
            businessDays
          );
        }
        break;
      case "ipca":
        if (formData.fixedRate) {
          grossReturn = calculateIPCAReturns(
            formData.principal,
            formData.ipcaRate,
            formData.fixedRate,
            days
          );
        }
        break;
    }
    
    // Calculate profit
    const profit = grossReturn - formData.principal;
    
    // Calculate taxes
    const irValue = profit * irTaxRate;
    const iofValue = profit * iofTaxRate;
    
    // Calculate net return
    const netReturn = grossReturn - irValue - iofValue;
    
    // Generate chart data
    const chartData = generateChartData(
      formData.startDate,
      formData.endDate,
      formData.principal,
      formData.modalityType,
      {
        preFixedRate: formData.preFixedRate,
        cdiRate: formData.cdiRate,
        cdiPercentage: formData.cdiPercentage,
        ipcaRate: formData.ipcaRate,
        fixedRate: formData.fixedRate,
      }
    );
    
    // Set results
    setResults({
      principal: formData.principal,
      startDate: formData.startDate,
      endDate: formData.endDate,
      grossReturn,
      days,
      businessDays,
      irTax: irTaxRate,
      irValue,
      iofTax: iofTaxRate,
      iofValue,
      netReturn,
      chartData,
    });
    
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-invest-dark">
            Simulador de Investimentos Renda Fixa - Arte da Renda
          </h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Dados do Investimento</h2>
          <InvestmentForm onCalculate={handleCalculate} />
        </div>
        
        {results && <InvestmentResults results={results} visible={showResults} />}
      </main>
      <footer className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
        <p>© 2025 Simulador de Investimentos Renda Fixa - Arte da Renda</p>
      </footer>
    </div>
  );
};

export default Index;
