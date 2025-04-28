import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, parse } from "date-fns";
interface DateSelectionProps {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
}
const DateSelection: React.FC<DateSelectionProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}) => {
  const formatDateToString = (date: Date) => {
    return format(date, "dd/MM/yy");
  };
  const parseDateString = (dateStr: string): Date | undefined => {
    try {
      return parse(dateStr, "dd/MM/yy", new Date());
    } catch {
      return undefined;
    }
  };
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = parseDateString(e.target.value);
    if (date) {
      onStartDateChange(date);
    }
  };
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = parseDateString(e.target.value);
    if (date) {
      onEndDateChange(date);
    }
  };
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <Label htmlFor="startDate" className="rounded-none bold-none">Data do Investimento (utilize as setas ↨ para selecionar o mês)</Label>
        <Input id="startDate" type="text" placeholder="dd/mm/aa" defaultValue={formatDateToString(startDate)} onChange={handleStartDateChange} />
      </div>

      <div className="space-y-3">
        <Label htmlFor="endDate">Vencimento do Investimento</Label>
        <Input id="endDate" type="text" placeholder="dd/mm/aa" defaultValue={formatDateToString(endDate)} onChange={handleEndDateChange} />
      </div>
    </div>;
};
export default DateSelection;