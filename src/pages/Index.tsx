
import React, { useState } from "react";
import InvestmentForm from "@/components/InvestmentForm";
import InvestmentResults from "@/components/InvestmentResults";
import { Button } from "@/components/ui/button";
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
import { InvestmentFormData } from "@/types/investment";

const Index = () => {
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleCalculate = (formData: InvestmentFormData) => {
    const businessDays = calculateBusinessDays(
      formData.startDate, 
      formData.endDate
    );
    
    const days = calculateTotalDays(formData.startDate, formData.endDate);
    
    const irTaxRate = calculateIRTax(days, formData.investmentType);
    
    const iofTaxRate = calculateIOFTax(days, formData.investmentType);
    
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
          // For IPCA+ calculations, we use calendar days rather than business days
          // because IPCA is based on calendar periods
          grossReturn = calculateIPCAReturns(
            formData.principal,
            formData.ipcaRate,
            formData.fixedRate,
            days // Using calendar days for IPCA+
          );
        }
        break;
    }
    
    const profit = grossReturn - formData.principal;
    
    const irValue = profit * irTaxRate;
    const iofValue = profit * iofTaxRate;
    
    const netReturn = ['LCD', 'LCI', 'LCA'].includes(formData.investmentType) 
      ? grossReturn 
      : grossReturn - irValue - iofValue;
    
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
    
    document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#7615ab] shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-white">
            Simulador de Investimentos Renda Fixa - Arte da Renda
          </h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Dados do Investimento</h2>
          <InvestmentForm onCalculate={handleCalculate} />
        </div>
        
        {results && (
          <div className="scroll-mt-8" id="results">
            <InvestmentResults results={results} visible={showResults} />
          </div>
        )}
        
        {showResults && (
          <div className="mt-8 flex justify-center gap-6">
            <Button
              variant="link"
              className="text-[#7615ab] hover:text-[#7615ab]/80"
              onClick={() => window.open('https://www.instagram.com/artedarendainvest', '_blank', 'width=800,height=600')}
            >
              Visite nosso Instagram
            </Button>
            <Button
              variant="link"
              className="text-[#7615ab] hover:text-[#7615ab]/80"
              onClick={() => window.open('https://www.artedarenda.com.br/', '_blank', 'width=800,height=600')}
            >
              Visite nosso Blog
            </Button>
          </div>
        )}
      </main>
      
      <footer className="bg-[#7615ab]">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-white">
          <p>© 2025 Simulador de Investimentos Renda Fixa - Arte da Renda</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
