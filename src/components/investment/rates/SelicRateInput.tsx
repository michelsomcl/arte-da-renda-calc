
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatNumberInput } from "@/utils/format-utils";

interface SelicRateInputProps {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
}

export const SelicRateInput: React.FC<SelicRateInputProps> = ({ value, onChange }) => {
  return (
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
        value={formatNumberInput(value.toString())}
        onChange={(e) => onChange(e, "selicRate")}
        className="text-right"
      />
    </div>
  );
};
