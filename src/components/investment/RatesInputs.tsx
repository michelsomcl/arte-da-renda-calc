
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface RatesInputsProps {
  selicRate: number;
  cdiRate: number;
  ipcaRate: number;
  preFixedRate?: number;
  cdiPercentage?: number;
  fixedRate?: number;
  modalityType: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
}

export const RatesInputs: React.FC<RatesInputsProps> = ({
  selicRate,
  cdiRate,
  ipcaRate,
  preFixedRate,
  cdiPercentage,
  fixedRate,
  modalityType,
  onInputChange,
}) => {
  const formatNumberInput = (value: string, isPercentage: boolean = true) => {
    const numValue = value.replace(/[^\d,]/g, '').replace(/\./g, '');
    if (!numValue) return '';
    
    const normalized = numValue.replace(',', '.');
    const number = parseFloat(normalized);
    if (isNaN(number)) return '';
    
    return number.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + (isPercentage ? '%' : '');
  };

  return (
    <>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label htmlFor="selicRate">SELIC atual (%)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-7 px-2 py-1"
                onClick={(e) => {
                  e.preventDefault();
                  window.open('https://www.bcb.gov.br/controleinflacao/historicotaxasjuros', '_blank');
                }}
              >
                Consultar
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h3 className="font-medium">Histórico de taxas de juros</h3>
                <p className="text-sm text-muted-foreground">
                  Consulte o histórico de taxas SELIC no site do Banco Central do Brasil.
                </p>
                <div className="flex justify-end">
                  <a 
                    href="https://www.bcb.gov.br/controleinflacao/historicotaxasjuros" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Acessar site do BCB
                  </a>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <Input
          id="selicRate"
          type="text"
          value={formatNumberInput(selicRate.toString())}
          onChange={(e) => onInputChange(e, "selicRate")}
          className="text-right"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="cdiRate">CDI atual (%)</Label>
        <Input
          id="cdiRate"
          type="text"
          value={formatNumberInput(cdiRate.toString())}
          disabled
          className="text-right bg-muted"
        />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label htmlFor="ipcaRate">IPCA atual (%)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-7 px-2 py-1"
                onClick={(e) => {
                  e.preventDefault();
                  window.open('https://www.ibge.gov.br/explica/inflacao.php', '_blank');
                }}
              >
                Consultar
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h3 className="font-medium">Índice de inflação</h3>
                <p className="text-sm text-muted-foreground">
                  Consulte o IPCA no site do IBGE.
                </p>
                <div className="flex justify-end">
                  <a 
                    href="https://www.ibge.gov.br/explica/inflacao.php" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Acessar site do IBGE
                  </a>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <Input
          id="ipcaRate"
          type="text"
          value={formatNumberInput(ipcaRate.toString())}
          onChange={(e) => onInputChange(e, "ipcaRate")}
          className="text-right"
        />
      </div>

      {modalityType === "pre-fixed" && (
        <div className="space-y-3">
          <Label htmlFor="preFixedRate">Taxa Pré-fixada (%)</Label>
          <Input
            id="preFixedRate"
            type="text"
            value={formatNumberInput(preFixedRate?.toString() || '0')}
            onChange={(e) => onInputChange(e, "preFixedRate")}
            className="text-right"
          />
        </div>
      )}

      {modalityType === "post-fixed" && (
        <div className="space-y-3">
          <Label htmlFor="cdiPercentage">% do CDI</Label>
          <Input
            id="cdiPercentage"
            type="text"
            value={formatNumberInput(cdiPercentage?.toString() || '0')}
            onChange={(e) => onInputChange(e, "cdiPercentage")}
            className="text-right"
          />
        </div>
      )}

      {modalityType === "ipca" && (
        <div className="space-y-3">
          <Label htmlFor="fixedRate">Taxa parte fixa (% + IPCA)</Label>
          <Input
            id="fixedRate"
            type="text"
            value={formatNumberInput(fixedRate?.toString() || '0')}
            onChange={(e) => onInputChange(e, "fixedRate")}
            className="text-right"
          />
        </div>
      )}
    </>
  );
};
