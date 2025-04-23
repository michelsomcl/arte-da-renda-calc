
import React, { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { parsePercentageInput, parseCurrencyInput } from "@/utils/investment-utils";

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
    cdiRate: 11.15, // SELIC - 0.1
    ipcaRate: 4.5,
    preFixedRate: 12.0,
    startDate: new Date(),
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    principal: 1000,
  });

  const handleSelicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selicValue = parsePercentageInput(e.target.value);
    setFormData({
      ...formData,
      selicRate: selicValue,
      cdiRate: Math.max(0, selicValue - 0.1), // CDI = SELIC - 0.1
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    field: keyof InvestmentFormData
  ) => {
    if (field === "principal") {
      setFormData({
        ...formData,
        [field]: parseCurrencyInput(e.target.value),
      });
    } else {
      setFormData({
        ...formData,
        [field]: parsePercentageInput(e.target.value),
      });
    }
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(formData);
  };

  return (
    <form onSubmit={handleCalculate} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="investmentType">Título</Label>
          <Select 
            value={formData.investmentType} 
            onValueChange={(value) => setFormData({ ...formData, investmentType: value })}
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
            value={formData.modalityType} 
            onValueChange={(value) => setFormData({ ...formData, modalityType: value })}
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

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="selicRate">SELIC atual (%)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-7 px-2 py-1"
                  onClick={(e) => e.preventDefault()}
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
            value={formData.selicRate}
            onChange={handleSelicChange}
            className="text-right"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="cdiRate">CDI atual (%)</Label>
          <Input
            id="cdiRate"
            type="text"
            value={formData.cdiRate.toFixed(2)}
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
                  onClick={(e) => e.preventDefault()}
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
            value={formData.ipcaRate}
            onChange={(e) => handleInputChange(e, "ipcaRate")}
            className="text-right"
          />
        </div>

        {/* Dynamic fields based on modality */}
        {formData.modalityType === "pre-fixed" && (
          <div className="space-y-3">
            <Label htmlFor="preFixedRate">Taxa Pré-fixada (%)</Label>
            <Input
              id="preFixedRate"
              type="text"
              value={formData.preFixedRate || ""}
              onChange={(e) => handleInputChange(e, "preFixedRate")}
              className="text-right"
            />
          </div>
        )}

        {formData.modalityType === "post-fixed" && (
          <div className="space-y-3">
            <Label htmlFor="cdiPercentage">% do CDI</Label>
            <Input
              id="cdiPercentage"
              type="text"
              value={formData.cdiPercentage || ""}
              onChange={(e) => handleInputChange(e, "cdiPercentage")}
              className="text-right"
            />
          </div>
        )}

        {formData.modalityType === "ipca" && (
          <div className="space-y-3">
            <Label htmlFor="fixedRate">Taxa parte fixa (% + IPCA)</Label>
            <Input
              id="fixedRate"
              type="text"
              value={formData.fixedRate || ""}
              onChange={(e) => handleInputChange(e, "fixedRate")}
              className="text-right"
            />
          </div>
        )}

        <div className="space-y-3">
          <Label htmlFor="startDate">Data do Investimento</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="startDate"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.startDate ? (
                  format(formData.startDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                ) : (
                  <span>Selecione uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={(date) => date && setFormData({ ...formData, startDate: date })}
                initialFocus
                locale={ptBR}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-3">
          <Label htmlFor="endDate">Vencimento do Investimento</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="endDate"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.endDate ? (
                  format(formData.endDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                ) : (
                  <span>Selecione uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.endDate}
                onSelect={(date) => date && setFormData({ ...formData, endDate: date })}
                disabled={(date) => date <= formData.startDate}
                initialFocus
                locale={ptBR}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-3">
          <Label htmlFor="principal">Valor do Aporte</Label>
          <div className="currency-input">
            <Input
              id="principal"
              type="text"
              value={formData.principal.toFixed(2).replace('.', ',')}
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
