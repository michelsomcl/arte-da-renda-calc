
import React from "react";
import { formatPercentage } from "@/utils/investment-utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useInvestmentForm } from "@/hooks/useInvestmentForm";
import TypeModality from "./investment/TypeModality";
import RateInputs from "./investment/RateInputs";
import DateSelection from "./investment/DateSelection";

interface InvestmentFormProps {
  onCalculate: (formData: any) => void;
}

const InvestmentForm: React.FC<InvestmentFormProps> = ({ onCalculate }) => {
  const { 
    formData, 
    setFormData, 
    inputs, 
    handlers 
  } = useInvestmentForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(formData);
    document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <TypeModality
        investmentType={formData.investmentType}
        modalityType={formData.modalityType}
        onInvestmentTypeChange={(value) => setFormData({ ...formData, investmentType: value })}
        onModalityTypeChange={(value) => setFormData({ ...formData, modalityType: value })}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RateInputs
          modalityType={formData.modalityType}
          inputs={inputs}
          cdiRate={formData.cdiRate}
          handlers={handlers}
          formatPercentage={formatPercentage}
        />

        <div className="space-y-3">
          <Label htmlFor="principal">Valor do Aporte</Label>
          <div className="currency-input">
            <Input
              id="principal"
              type="text"
              value={inputs.principalInput}
              onChange={handlers.handlePrincipalChange}
              onBlur={handlers.handleBlurCurrency}
              className="text-right"
            />
          </div>
        </div>
      </div>

      <DateSelection
        startDate={formData.startDate}
        endDate={formData.endDate}
        onStartDateChange={(date) => date && setFormData({ ...formData, startDate: date })}
        onEndDateChange={(date) => date && setFormData({ ...formData, endDate: date })}
      />

      <div className="flex justify-end">
        <Button type="submit" className="w-full md:w-auto bg-[#7615ab] hover:bg-[#7615ab]/90">
          Calcular Rentabilidade
        </Button>
      </div>
    </form>
  );
};

export default InvestmentForm;

