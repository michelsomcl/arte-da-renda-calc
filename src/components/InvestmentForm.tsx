
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InvestmentTypeInputs } from "./investment/InvestmentTypeInputs";
import { RatesInputs } from "./investment/RatesInputs";
import { DateInputs } from "./investment/DateInputs";

interface InvestmentFormProps {
  onCalculate: (formData: InvestmentFormData) => void;
}

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

const InvestmentForm: React.FC<InvestmentFormProps> = ({ onCalculate }) => {
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof InvestmentFormData
  ) => {
    const value = e.target.value.replace(/%/g, '');
    
    if (field === "principal") {
      const numValue = parseCurrencyInput(value);
      setFormData({
        ...formData,
        [field]: numValue,
      });
    } else {
      const numValue = parsePercentageInput(value);
      setFormData({
        ...formData,
        [field]: numValue,
        cdiRate: field === "selicRate" ? Math.max(0, numValue - 0.1) : formData.cdiRate,
      });
    }
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(formData);
  };

  const parseCurrencyInput = (value: string): number => {
    return Number(value.replace(/\./g, '').replace(',', '.'));
  };

  const parsePercentageInput = (value: string): number => {
    return Number(value.replace(',', '.'));
  };

  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <form onSubmit={handleCalculate} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InvestmentTypeInputs
          investmentType={formData.investmentType}
          modalityType={formData.modalityType}
          onInvestmentTypeChange={(value) => setFormData({ ...formData, investmentType: value })}
          onModalityTypeChange={(value) => setFormData({ ...formData, modalityType: value })}
        />

        <RatesInputs
          selicRate={formData.selicRate}
          cdiRate={formData.cdiRate}
          ipcaRate={formData.ipcaRate}
          preFixedRate={formData.preFixedRate}
          cdiPercentage={formData.cdiPercentage}
          fixedRate={formData.fixedRate}
          modalityType={formData.modalityType}
          onInputChange={handleInputChange}
        />

        <DateInputs
          startDate={formData.startDate}
          endDate={formData.endDate}
          onStartDateChange={(date) => date && setFormData({ ...formData, startDate: date })}
          onEndDateChange={(date) => date && setFormData({ ...formData, endDate: date })}
        />

        <div className="space-y-3">
          <Label htmlFor="principal">Valor do Aporte</Label>
          <div className="currency-input">
            <Input
              id="principal"
              type="text"
              value={formatCurrency(formData.principal)}
              onChange={(e) => handleInputChange(e, "principal")}
              className="text-right"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="w-full md:w-auto">
          Calcular Rentabilidade
        </Button>
      </div>
    </form>
  );
};

export default InvestmentForm;
