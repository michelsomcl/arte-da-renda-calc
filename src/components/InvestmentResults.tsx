import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercentage, ChartDataPoint } from "@/utils/investment-utils";

interface InvestmentResultsProps {
  results: {
    principal: number;
    startDate: Date;
    endDate: Date;
    grossReturn: number;
    days: number;
    businessDays: number;
    irTax: number;
    irValue: number;
    iofTax: number;
    iofValue: number;
    netReturn: number;
    chartData: ChartDataPoint[];
  };
  visible: boolean;
}

const InvestmentResults: React.FC<InvestmentResultsProps> = ({ results, visible }) => {
  if (!visible) return null;

  // Format dates for the chart
  const chartData = results.chartData.map((item) => ({
    date: format(item.date, "MMM/yy", { locale: ptBR }),
    principal: item.principal,
    accumulated: item.accumulated,
  }));

  // Calculate the minimum value for Y-axis
  const minValue = Math.min(...chartData.map(item => Math.min(item.principal, item.accumulated)));
  const maxValue = Math.max(...chartData.map(item => Math.max(item.principal, item.accumulated)));

  return (
    <div className={`space-y-8 animate-fade-in ${visible ? '' : 'hidden'}`}>
      <Card>
        <CardHeader>
          <CardTitle>Resultados da Simulação</CardTitle>
          <CardDescription>
            Detalhes sobre o seu investimento e a rentabilidade projetada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Valor do Aporte</h3>
                <p className="text-2xl font-semibold">{formatCurrency(results.principal)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Data do Investimento</h3>
                <p className="text-lg">{format(results.startDate, "dd/MM/yyyy")}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Vencimento do Investimento</h3>
                <p className="text-lg">{format(results.endDate, "dd/MM/yyyy")}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Período</h3>
                <p className="text-lg">{results.days} dias ({results.businessDays} dias úteis)</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Rentabilidade Bruta</h3>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-semibold text-invest">{formatCurrency(results.grossReturn)}</p>
                  <p className="text-invest">
                    (+{formatPercentage((results.grossReturn / results.principal - 1) * 100)})
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Imposto de Renda</h3>
                <p className="text-lg">
                  {formatCurrency(results.irValue)} ({formatPercentage(results.irTax * 100)})
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">IOF</h3>
                <p className="text-lg">
                  {formatCurrency(results.iofValue)} ({formatPercentage(results.iofTax * 100)})
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Rentabilidade Líquida</h3>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-semibold text-invest-dark">{formatCurrency(results.netReturn)}</p>
                  <p className="text-invest-dark">
                    (+{formatPercentage((results.netReturn / results.principal - 1) * 100)})
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Evolução do Investimento</CardTitle>
          <CardDescription>
            Visualize o crescimento do seu investimento ao longo do tempo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis
                  domain={[minValue * 0.99, maxValue * 1.01]}
                  tickFormatter={(value) => new Intl.NumberFormat('pt-BR', {
                    notation: 'compact',
                    compactDisplay: 'short',
                    currency: 'BRL',
                  }).format(value)}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(Number(value)), ""]}
                  labelFormatter={(label) => `Data: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="principal"
                  name="Valor Investido"
                  stroke="#a44bc7"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="accumulated"
                  name="Valor Acumulado"
                  stroke="#7615ab"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestmentResults;
