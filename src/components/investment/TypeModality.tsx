
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TypeModalityProps {
  investmentType: string;
  modalityType: string;
  onInvestmentTypeChange: (value: string) => void;
  onModalityTypeChange: (value: string) => void;
}

const TypeModality: React.FC<TypeModalityProps> = ({
  investmentType,
  modalityType,
  onInvestmentTypeChange,
  onModalityTypeChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <Label htmlFor="investmentType">Título</Label>
        <Select 
          value={investmentType} 
          onValueChange={onInvestmentTypeChange}
        >
          <SelectTrigger id="investmentType">
            <SelectValue placeholder="Selecione o título" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CDB">CDB</SelectItem>
            <SelectItem value="LCD">LCD</SelectItem>
            <SelectItem value="LCI">LCI</SelectItem>
            <SelectItem value="LCA">LCA</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label htmlFor="modalityType">Modalidade</Label>
        <Select 
          value={modalityType} 
          onValueChange={onModalityTypeChange}
        >
          <SelectTrigger id="modalityType">
            <SelectValue placeholder="Selecione a modalidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pre-fixed">Pré-fixado</SelectItem>
            <SelectItem value="post-fixed">Pós-Fixado</SelectItem>
            <SelectItem value="ipca">IPCA+</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TypeModality;

