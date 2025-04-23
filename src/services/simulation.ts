
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export interface SimulationData {
  investment_type: string;
  modality_type: string;
  selic_rate: number;
  cdi_rate: number;
  ipca_rate: number;
  pre_fixed_rate?: number;
  cdi_percentage?: number;
  fixed_rate?: number;
  start_date: Date;
  end_date: Date;
  principal: number;
  gross_return: number;
  days: number;
  business_days: number;
  ir_tax: number;
  ir_value: number;
  iof_tax: number;
  iof_value: number;
  net_return: number;
}

export async function saveSimulation(data: SimulationData) {
  try {
    const { error } = await supabase
      .from('simulacoes')
      .insert([data]);

    if (error) throw error;

    toast.success("Simulação salva com sucesso!");
    return true;
  } catch (error) {
    console.error('Erro ao salvar simulação:', error);
    toast.error("Erro ao salvar simulação. Tente novamente.");
    return false;
  }
}
