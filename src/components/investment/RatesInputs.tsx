
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelicRateInput } from "./rates/SelicRateInput";
import { CdiRateInput } from "./rates/CdiRateInput";
import { IpcaRateInput } from "./rates/IpcaRateInput";
import { formatNumberInput } from "@/utils/format-utils";

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
  return (
    <>
      <SelicRateInput value={selicRate} onChange={onInputChange} />
      <CdiRateInput value={cdiRate} />
      <IpcaRateInput value={ipcaRate} onChange={onInputChange} />

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
