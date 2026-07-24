import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

interface BreakdownItem {
  category: string;
  amount: number;
  percentage: number;
}

interface ExpenseBreakdownChartProps {
  data: BreakdownItem[];
}

const COLORS = [
  '#f43f5e', // rose
  '#6366f1', // indigo
  '#06b6d4', // cyan
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#10b981', // emerald
  '#ec4899', // pink
  '#64748b'  // slate
];

export function ExpenseBreakdownChart({ data }: ExpenseBreakdownChartProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(val);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1 font-mono">
          <p className="font-bold text-slate-200">{item.category}</p>
          <div className="flex items-center justify-between space-x-4 text-rose-400">
            <span>Expense Amount:</span>
            <span className="font-extrabold">{formatCurrency(item.amount)}</span>
          </div>
          <div className="flex items-center justify-between space-x-4 text-slate-300">
            <span>Percentage:</span>
            <span className="font-extrabold">{item.percentage}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const totalExpenseSum = data.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
            <PieChartIcon className="w-4 h-4 text-rose-600" />
            Expense Breakdown
          </h3>
          <p className="text-[11px] text-slate-500">Distribution of operating expenditures by category.</p>
        </div>
        <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100">
          Total: {formatCurrency(totalExpenseSum)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Pie Chart */}
        <div className="h-60 w-full relative flex items-center justify-center">
          {data.length === 0 ? (
            <div className="text-slate-400 text-xs italic">No expense entries found.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="amount"
                  nameKey="category"
                >
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Legend / Category List */}
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {data.map((item, idx) => (
            <div
              key={item.category}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition text-xs"
            >
              <div className="flex items-center space-x-2 truncate mr-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                ></span>
                <span className="font-bold text-slate-800 truncate">{item.category}</span>
              </div>

              <div className="text-right shrink-0 font-mono">
                <p className="font-extrabold text-slate-900">{formatCurrency(item.amount)}</p>
                <p className="text-[10px] text-slate-500 font-bold">{item.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
