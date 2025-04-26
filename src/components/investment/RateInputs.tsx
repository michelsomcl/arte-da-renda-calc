
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RateInputsProps {
  modalityType: string;
  inputs: {
    selicInput: string;
    ipcaInput: string;
    preFixedInput: string;
    cdiPercentageInput: string;
    fixedRateInput: string;
  };
  cdiRate: number;
  handlers: {
    handleSelicChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleIpcaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handlePreFixedChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCdiPercentageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFixedRateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleBlurPercentage: (e: React.FocusEvent<HTMLInputElement>, setter: (value: string) => void, value: number) => void;
  };
  formatPercentage: (value: number) => string;
}

const handleOpenExternalLink = (url: string) => {
  window.open(url, '_blank', 'width=800,height=600');
};

const RateInputs: React.FC<RateInputsProps> = ({
  modalityType,
  inputs,
  cdiRate,
  handlers,
  formatPercentage
}) => {
  return (
    <>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label htmlFor="selicRate">SELIC atual (%)</Label>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-7 px-2 py-1"
            onClick={(e) => {
              e.preventDefault();
              handleOpenExternalLink('https://www.bcb.gov.br/controleinflacao/historicotaxasjuros');
            }}
          >
            Consultar
          </Button>
        </div>
        <Input
          id="selicRate"
          type="text"
          value={inputs.selicInput}
          onChange={handlers.handleSelicChange}
          onBlur={(e) => handlers.handleBlurPercentage(e, 
            (value) => handlers.handleSelicChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>), 
            parseFloat(inputs.selicInput)
          )}
          className="text-right"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="cdiRate">CDI atual (%)</Label>
        <Input
          id="cdiRate"
          type="text"
          value={formatPercentage(cdiRate)}
          disabled
          className="text-right bg-muted"
        />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label htmlFor="ipcaRate">IPCA atual (%)</Label>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-7 px-2 py-1"
            onClick={(e) => {
              e.preventDefault();
              handleOpenExternalLink('https://www.ibge.gov.br/explica/inflacao.php');
            }}
          >
            Consultar
          </Button>
        </div>
        <Input
          id="ipcaRate"
          type="text"
          value={inputs.ipcaInput}
          onChange={handlers.handleIpcaChange}
          onBlur={(e) => handlers.handleBlurPercentage(e,
            (value) => handlers.handleIpcaChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>),
            parseFloat(inputs.ipcaInput)
          )}
          className="text-right"
        />
      </div>

      {modalityType === "pre-fixed" && (
        <div className="space-y-3">
          <Label htmlFor="preFixedRate">Taxa Pré-fixada (%)</Label>
          <Input
            id="preFixedRate"
            type="text"
            value={inputs.preFixedInput}
            onChange={handlers.handlePreFixedChange}
            onBlur={(e) => handlers.handleBlurPercentage(e,
              (value) => handlers.handlePreFixedChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>),
              parseFloat(inputs.preFixedInput)
            )}
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
            value={inputs.cdiPercentageInput}
            onChange={handlers.handleCdiPercentageChange}
            onBlur={(e) => handlers.handleBlurPercentage(e,
              (value) => handlers.handleCdiPercentageChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>),
              parseFloat(inputs.cdiPercentageInput)
            )}
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
            value={inputs.fixedRateInput}
            onChange={handlers.handleFixedRateChange}
            onBlur={(e) => handlers.handleBlurPercentage(e,
              (value) => handlers.handleFixedRateChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>),
              parseFloat(inputs.fixedRateInput)
            )}
            className="text-right"
          />
        </div>
      )}
    </>
  );
};

export default RateInputs;

