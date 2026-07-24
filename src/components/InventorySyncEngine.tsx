import { useState } from 'react';
import {
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Play,
  ShieldCheck,
  Zap,
  Sliders,
  DollarSign,
  Search
} from 'lucide-react';
import { ProductItem } from '../types';
import { useTableViewportFill, PlaceholderRows } from './ViewportTable';

interface InventorySyncEngineProps {
  products: ProductItem[];
  onTriggerSync: () => void;
}

export function InventorySyncEngine({ products, onTriggerSync }: InventorySyncEngineProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [markupMultiplier, setMarkupMultiplier] = useState(2.2);
  const [mapProtectionStrict, setMapProtectionStrict] = useState(true);
  const [autoZeroOutStock, setAutoZeroOutStock] = useState(true);
  const [lastSyncStatus, setLastSyncStatus] = useState<string | null>(null);

  const handleSyncNow = () => {
    setIsSyncing(true);
    setLastSyncStatus('Polling 12,450 SKUs across B2B EDI feeds & supplier APIs...');
    setTimeout(() => {
      onTriggerSync();
      setIsSyncing(false);
      setLastSyncStatus('Sync complete! Updated 14 price changes and verified MAP compliance on all SKUs.');
    }, 2500);
  };

  const lowStockCount = products.filter((p) => p.stockQuantity < 20).length;
  const mapProtectedCount = products.filter((p) => p.mapPrice && p.mapPrice > 0).length;

  const { containerRef: syncTableRef, blankRowsCount: syncBlankRows } = useTableViewportFill({
    actualRowCount: products.length,
    rowHeight: 32,
    headerHeight: 28,
  });

  return (
    <div className="space-y-3">
      {/* Header Bar (Single 30px Bar) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white border border-slate-200 rounded-xl px-3.5 min-h-[30px] py-1 shadow-xs">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-4 h-4 text-amber-600 shrink-0" />
          <h2 className="text-xs font-extrabold text-slate-900 tracking-tight whitespace-nowrap">
            Real-Time Inventory & Price Sync Engine
          </h2>
          <span className="hidden md:inline text-[10px] text-slate-500 font-medium truncate border-l border-slate-200 pl-2">
            Sync-StockAgent • Polls supplier inventory feeds every 15m, enforces MAP policies
          </span>
        </div>

        <button
          onClick={handleSyncNow}
          disabled={isSyncing}
          className="h-[26px] px-2.5 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold rounded-md transition shadow-xs flex items-center space-x-1 cursor-pointer disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Polling 12k SKUs...' : 'Trigger Inventory & MAP Sync'}</span>
        </button>
      </div>

      {/* 28px Inline Stat Chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        <div className="h-[28px] px-2.5 bg-white border border-slate-200 rounded-md inline-flex items-center text-[10px] font-bold text-slate-600 shadow-2xs whitespace-nowrap">
          <span className="text-slate-900 font-extrabold text-xs mr-1.5">{products.length}</span> TOTAL MONITORED SKUs
        </div>

        <div className="h-[28px] px-2.5 bg-amber-50 border border-amber-200 rounded-md inline-flex items-center text-[10px] font-bold text-amber-800 shadow-2xs whitespace-nowrap">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mr-1" />
          <span className="text-amber-900 font-extrabold text-xs mr-1.5">{lowStockCount}</span> LOW STOCK SKUs (&lt;20)
        </div>

        <div className="h-[28px] px-2.5 bg-emerald-50 border border-emerald-200 rounded-md inline-flex items-center text-[10px] font-bold text-emerald-800 shadow-2xs whitespace-nowrap">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-1" />
          <span className="text-emerald-900 font-extrabold text-xs mr-1.5">{mapProtectedCount}</span> MAP PROTECTED SKUs
        </div>
      </div>

      {lastSyncStatus && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[11px] p-2 rounded-lg flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-amber-600" />
          <span>{lastSyncStatus}</span>
        </div>
      )}

      {/* Sync Strategy & Pricing Rules Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Rules Config Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
            <Sliders className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">Automation Rules & Pricing Rules</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 flex justify-between">
                <span>Default Markup Multiplier</span>
                <span className="text-amber-700 font-mono">{markupMultiplier}x ({((markupMultiplier - 1) * 100).toFixed(0)}% Margin)</span>
              </label>
              <input
                type="range"
                min="1.5"
                max="3.5"
                step="0.1"
                value={markupMultiplier}
                onChange={(e) => setMarkupMultiplier(parseFloat(e.target.value))}
                className="w-full mt-2 accent-amber-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <p className="text-xs font-semibold text-slate-900">Enforce MAP Floor Prices</p>
                <p className="text-[10px] text-slate-500">Never allow price drops below supplier MAP</p>
              </div>
              <input
                type="checkbox"
                checked={mapProtectionStrict}
                onChange={(e) => setMapProtectionStrict(e.target.checked)}
                className="w-4 h-4 accent-amber-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <p className="text-xs font-semibold text-slate-900">Auto Zero-Out Out of Stock</p>
                <p className="text-[10px] text-slate-500">Immediately unpublish when supplier Qty = 0</p>
              </div>
              <input
                type="checkbox"
                checked={autoZeroOutStock}
                onChange={(e) => setAutoZeroOutStock(e.target.checked)}
                className="w-4 h-4 accent-amber-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Live SKU Status Monitor Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Live Catalog SKU Sync Table</h3>
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-500">Low Stock SKUs: <strong className="text-amber-600">{lowStockCount}</strong></span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">MAP Protected: <strong className="text-emerald-700">{mapProtectedCount}</strong></span>
            </div>
          </div>

          <div className="overflow-x-auto flex-1 overflow-y-auto" ref={syncTableRef}>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-slate-200 font-semibold uppercase text-[10px]">
                  <th className="pb-2">SKU</th>
                  <th className="pb-2">Product Title</th>
                  <th className="pb-2">Cost</th>
                  <th className="pb-2">Selling</th>
                  <th className="pb-2">MAP Floor</th>
                  <th className="pb-2">Stock Qty</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-2.5 font-mono text-amber-700 font-semibold">{p.sku}</td>
                    <td className="py-2.5 text-slate-900 font-medium max-w-[180px] truncate">{p.title}</td>
                    <td className="py-2.5 text-slate-600 font-mono">${p.costPrice.toFixed(2)}</td>
                    <td className="py-2.5 text-emerald-700 font-mono font-semibold">${p.sellingPrice.toFixed(2)}</td>
                    <td className="py-2.5 text-purple-700 font-mono">{p.mapPrice ? `$${p.mapPrice.toFixed(2)}` : 'N/A'}</td>
                    <td className="py-2.5">
                      <span className={`font-mono font-bold ${p.stockQuantity < 20 ? 'text-amber-600' : 'text-blue-600'}`}>
                        {p.stockQuantity} units
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        Synced
                      </span>
                    </td>
                  </tr>
                ))}
                <PlaceholderRows count={syncBlankRows} colCount={7} rowHeight={32} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
