
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatNumberInput } from "@/utils/format-utils";

interface CdiRateInputProps {
  value: number;
}

export const CdiRateInput: React.FC<CdiRateInputProps> = ({ value }) => {
  return (
    <div className="space-y-3">
      <Label htmlFor="cdiRate">CDI atual (%)</Label>
      <Input
        id="cdiRate"
        type="text"
        value={formatNumberInput(value.toString())}
        disabled
        className="text-right bg-muted"
      />
    </div>
  );
};
