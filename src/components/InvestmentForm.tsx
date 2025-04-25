
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
import { formatPercentage, parsePercentageInput, parseCurrencyInput } from "@/utils/investment-utils";

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
  
  // Add state to track current input values
  const [selicInput, setSelicInput] = useState(formatPercentage(formData.selicRate));
  const [ipcaInput, setIpcaInput] = useState(formatPercentage(formData.ipcaRate));
  const [preFixedInput, setPreFixedInput] = useState(formatPercentage(formData.preFixedRate || 0));
  const [cdiPercentageInput, setCdiPercentageInput] = useState(formatPercentage(formData.cdiPercentage || 100));
  const [fixedRateInput, setFixedRateInput] = useState(formatPercentage(formData.fixedRate || 0));
  const [principalInput, setPrincipalInput] = useState(formData.principal.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  }));

  const handleSelicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSelicInput(inputValue);
    
    const numericValue = parsePercentageInput(inputValue);
    
    setFormData({
      ...formData,
      selicRate: numericValue,
      cdiRate: Math.max(0, numericValue - 0.1), // CDI = SELIC - 0.1
    });
  };

  const handleIpcaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setIpcaInput(inputValue);
    
    const numericValue = parsePercentageInput(inputValue);
    
    setFormData({
      ...formData,
      ipcaRate: numericValue,
    });
  };

  const handlePreFixedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setPreFixedInput(inputValue);
    
    const numericValue = parsePercentageInput(inputValue);
    
    setFormData({
      ...formData,
      preFixedRate: numericValue,
    });
  };

  const handleCdiPercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setCdiPercentageInput(inputValue);
    
    const numericValue = parsePercentageInput(inputValue);
    
    setFormData({
      ...formData,
      cdiPercentage: numericValue,
    });
  };

  const handleFixedRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setFixedRateInput(inputValue);
    
    const numericValue = parsePercentageInput(inputValue);
    
    setFormData({
      ...formData,
      fixedRate: numericValue,
    });
  };

  const handlePrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setPrincipalInput(inputValue);
    
    const numericValue = parseCurrencyInput(inputValue);
    
    setFormData({
      ...formData,
      principal: numericValue,
    });
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(formData);
  };

  const handleBlurPercentage = (e: React.FocusEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>, value: number) => {
    setter(formatPercentage(value));
  };

  const handleBlurCurrency = (e: React.FocusEvent<HTMLInputElement>) => {
    setPrincipalInput(formData.principal.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }));
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
            value={selicInput}
            onChange={handleSelicChange}
            onBlur={(e) => handleBlurPercentage(e, setSelicInput, formData.selicRate)}
            className="text-right"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="cdiRate">CDI atual (%)</Label>
          <Input
            id="cdiRate"
            type="text"
            value={formatPercentage(formData.cdiRate)}
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
            value={ipcaInput}
            onChange={handleIpcaChange}
            onBlur={(e) => handleBlurPercentage(e, setIpcaInput, formData.ipcaRate)}
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
              value={preFixedInput}
              onChange={handlePreFixedChange}
              onBlur={(e) => handleBlurPercentage(e, setPreFixedInput, formData.preFixedRate || 0)}
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
              value={cdiPercentageInput}
              onChange={handleCdiPercentageChange}
              onBlur={(e) => handleBlurPercentage(e, setCdiPercentageInput, formData.cdiPercentage || 0)}
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
              value={fixedRateInput}
              onChange={handleFixedRateChange}
              onBlur={(e) => handleBlurPercentage(e, setFixedRateInput, formData.fixedRate || 0)}
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
              value={principalInput}
              onChange={handlePrincipalChange}
              onBlur={handleBlurCurrency}
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
