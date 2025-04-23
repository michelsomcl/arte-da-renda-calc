
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatNumberInput } from "@/utils/format-utils";

interface IpcaRateInputProps {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
}

export const IpcaRateInput: React.FC<IpcaRateInputProps> = ({ value, onChange }) => {
  return (
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
        value={formatNumberInput(value.toString())}
        onChange={(e) => onChange(e, "ipcaRate")}
        className="text-right"
      />
    </div>
  );
};
