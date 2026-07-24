import { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { BarChart2, LineChart as LineChartIcon } from 'lucide-react';

interface TrendItem {
  date: string;
  income: number;
  expense: number;
  net: number;
}

interface FinanceTrendChartProps {
  data: TrendItem[];
  title?: string;
}

export function FinanceTrendChart({ data, title = 'Income vs Expense Trend Analysis' }: FinanceTrendChartProps) {
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1 font-mono">
          <p className="font-bold border-b border-slate-700 pb-1 text-slate-300">{label}</p>
          {payload.map((p: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between space-x-4">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></span>
                <span>{p.name}:</span>
              </span>
              <span className="font-extrabold">{formatCurrency(p.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">{title}</h3>
          <p className="text-[11px] text-slate-500">
            Daily/Monthly financial timeline for income, expenses, and net cashflow.
          </p>
        </div>

        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setChartType('bar')}
            className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
              chartType === 'bar' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Bar View</span>
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
              chartType === 'line' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LineChartIcon className="w-3.5 h-3.5" />
            <span>Line View</span>
          </button>
        </div>
      </div>

      <div className="h-72 w-full pt-2">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">
            No financial timeline data available for the selected range.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={formatCurrency} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="net" name="Net Profit" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={formatCurrency} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="expense" name="Expense" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="net" name="Net Profit" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
