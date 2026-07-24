import { useState, FormEvent } from 'react';
import { AdminDataTable, Column } from './AdminDataTable';
import {
  Package,
  FileSpreadsheet,
  Sparkles,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  Search,
  Filter,
  Upload,
  RefreshCw,
  ExternalLink,
  Tag
} from 'lucide-react';
import { ProductItem } from '../types';

interface ProductCatalogStudioProps {
  products: ProductItem[];
  onAddProduct: (product: ProductItem) => void;
  onGenerateListingWithAI: (product: ProductItem) => Promise<void>;
  onCleanCSVWithAI: (rawCSV: string) => Promise<void>;
}

export function ProductCatalogStudio({
  products,
  onAddProduct,
  onGenerateListingWithAI,
  onCleanCSVWithAI,
}: ProductCatalogStudioProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(products[0] || null);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [rawCSVInput, setRawCSVInput] = useState('');
  const [isCleaningCSV, setIsCleaningCSV] = useState(false);
  const [isGeneratingListing, setIsGeneratingListing] = useState(false);

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateClick = async () => {
    if (!selectedProduct) return;
    setIsGeneratingListing(true);
    await onGenerateListingWithAI(selectedProduct);
    setIsGeneratingListing(false);
  };

  const handleCleanCSVSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!rawCSVInput.trim()) return;
    setIsCleaningCSV(true);
    await onCleanCSVWithAI(rawCSVInput);
    setIsCleaningCSV(false);
    setShowCSVModal(false);
    setRawCSVInput('');
  };

  const columns: Column<ProductItem>[] = [
    {
      id: 'item',
      header: 'Item',
      cell: (prod) => (
        <div className="flex items-center space-x-2">
          <img
            src={prod.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80'}
            alt={prod.title}
            className="w-7 h-7 rounded object-cover border border-slate-200 shrink-0"
          />
          <span className="text-xs font-semibold text-slate-900 truncate max-w-[110px]">
            {prod.title}
          </span>
        </div>
      ),
    },
    {
      id: 'sku',
      header: 'SKU & Category',
      cell: (prod) => (
        <div>
          <p className="text-[10px] font-mono text-purple-700 font-bold">{prod.sku}</p>
          <p className="text-[10px] text-slate-500 truncate max-w-[90px]">{prod.category}</p>
        </div>
      ),
    },
    {
      id: 'price',
      header: 'Price',
      headerClassName: 'text-right',
      className: 'text-right',
      cell: (prod) => (
        <span className="font-mono font-bold text-emerald-700">
          ${prod.sellingPrice.toFixed(2)}
        </span>
      ),
      width: '70px',
    }
  ];

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col overflow-hidden space-y-2.5 p-1">
      {/* Header Bar (Single 30px Bar) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white border border-slate-200 rounded-xl px-3.5 min-h-[30px] py-1 shadow-xs shrink-0">
        <div className="flex items-center space-x-2">
          <Package className="w-4 h-4 text-purple-600 shrink-0" />
          <h2 className="text-xs font-extrabold text-slate-900 tracking-tight whitespace-nowrap">
            Product Catalog & AI CSV Cleaner
          </h2>
          <span className="hidden md:inline text-[10px] text-slate-500 font-medium truncate border-l border-slate-200 pl-2">
            Omni-CatalogAgent • Cleans CSV rows, calculates markup, generates SEO listings
          </span>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setShowCSVModal(true)}
            className="h-[26px] px-2.5 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold rounded-md transition shadow-xs flex items-center space-x-1 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>AI CSV Catalog Cleaner</span>
          </button>
        </div>
      </div>

      {/* 28px Inline Stat Chips */}
      <div className="flex flex-wrap items-center gap-1.5 shrink-0">
        <div className="h-[28px] px-2.5 bg-white border border-slate-200 rounded-md inline-flex items-center text-[10px] font-bold text-slate-600 shadow-2xs whitespace-nowrap">
          <span className="text-slate-900 font-extrabold text-xs mr-1.5">{products.length}</span> CATALOG PRODUCTS
        </div>

        <div className="h-[28px] px-2.5 bg-purple-50 border border-purple-200 rounded-md inline-flex items-center text-[10px] font-bold text-purple-800 shadow-2xs whitespace-nowrap">
          <span className="text-purple-900 font-extrabold text-xs mr-1.5">{products.reduce((acc, p) => acc + p.stockQuantity, 0)}</span> UNITS IN STOCK
        </div>

        <div className="h-[28px] px-2.5 bg-emerald-50 border border-emerald-200 rounded-md inline-flex items-center text-[10px] font-bold text-emerald-800 shadow-2xs whitespace-nowrap">
          <span className="text-emerald-900 font-extrabold text-xs mr-1.5">
            {products.length ? (products.reduce((acc, p) => acc + p.marginPercent, 0) / products.length).toFixed(1) : '0'}%
          </span> AVG MARGIN
        </div>
      </div>

      {/* Product List + Inspector Grid */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">
        {/* Products List Column */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-3 flex flex-col min-h-0 h-full overflow-hidden space-y-2 shadow-xs">
          {/* Search bar (22px micro-input) */}
          <div className="relative shrink-0">
            <Search className="w-3 h-3 text-slate-400 absolute left-2 top-1.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search SKU, title, category..."
              className="w-full h-[22px] bg-slate-50 text-slate-900 text-[10px] rounded pl-6 pr-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div className="flex-1 min-h-0 flex flex-col">
            <AdminDataTable<ProductItem>
              columns={columns}
              data={filteredProducts}
              rowHeight={40}
              zebra={true}
              onRowClick={(prod) => setSelectedProduct(prod)}
              activeRowId={selectedProduct?.id}
              defaultPageSize={25}
            />
          </div>
        </div>

        {/* Selected Product Listing Inspector & AI Suite */}
        {selectedProduct ? (
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm overflow-y-auto h-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedProduct.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80'}
                  alt={selectedProduct.title}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-xs"
                />
                <div>
                  <span className="text-xs font-mono font-bold text-purple-700">{selectedProduct.sku}</span>
                  <h3 className="text-base font-bold text-slate-900">{selectedProduct.title}</h3>
                  <p className="text-xs text-slate-500">Supplier: {selectedProduct.supplierName} • {selectedProduct.category}</p>
                </div>
              </div>

              <button
                onClick={handleGenerateClick}
                disabled={isGeneratingListing}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm flex items-center space-x-2 cursor-pointer shrink-0 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isGeneratingListing ? 'Generating SEO Listing...' : 'Generate SEO Listing with AI'}</span>
              </button>
            </div>

            {/* Financial & Stock Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Cost Price</span>
                <p className="text-sm font-bold text-slate-900 mt-1">${selectedProduct.costPrice.toFixed(2)}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Retail Price</span>
                <p className="text-sm font-bold text-emerald-700 mt-1">${selectedProduct.sellingPrice.toFixed(2)}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Profit Margin</span>
                <p className="text-sm font-bold text-purple-700 mt-1">{selectedProduct.marginPercent.toFixed(1)}%</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Stock In USA</span>
                <p className="text-sm font-bold text-blue-700 mt-1">{selectedProduct.stockQuantity} Units</p>
              </div>
            </div>

            {/* Generated SEO Metadata */}
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-purple-600" />
                  <span>SEO Title Tag</span>
                </h4>
                <p className="text-xs text-indigo-700 font-semibold">{selectedProduct.seoTitle || selectedProduct.title}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">SEO Meta Description</h4>
                <p className="text-xs text-slate-700 leading-relaxed">{selectedProduct.seoDescription || 'No description generated yet.'}</p>
              </div>

              {/* Tags */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Optimized Product Tags</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedProduct.tags || []).map((t, idx) => (
                    <span key={idx} className="bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-mono px-2.5 py-1 rounded-lg">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Specifications */}
              {selectedProduct.specs && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Technical Specifications</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(selectedProduct.specs).map(([key, val]) => (
                      <div key={key} className="bg-white p-2 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">{key}</span>
                        <span className="text-slate-800 font-medium">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-slate-400 shadow-sm">
            <Package className="w-12 h-12 text-slate-400 mb-2" />
            <p className="text-sm font-semibold text-slate-500">Select a product to inspect and optimize with AI</p>
          </div>
        )}
      </div>

      {/* CSV Cleaner Modal */}
      {showCSVModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">AI CSV Catalog Normalizer</h3>
              </div>
              <button onClick={() => setShowCSVModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-xs cursor-pointer">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Paste raw supplier CSV snippet or messy spreadsheet data below. Omni-CatalogAgent will automatically map columns, calculate profit margins, and import clean product records.
            </p>

            <form onSubmit={handleCleanCSVSubmit} className="space-y-4">
              <textarea
                rows={7}
                value={rawCSVInput}
                onChange={(e) => setRawCSVInput(e.target.value)}
                placeholder={`SKU, Supplier_Name, Cost_USD, Stock_Qty, Raw_Item_Title\nAH-901, Midwest Wholesale, 45.00, 200, Brass Lamp Stand\nTT-802, Alpha Outdoor, 18.50, 500, Survival Utility Knife`}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-purple-500 leading-relaxed"
              />

              <div className="flex items-center justify-end space-x-2 border-t border-slate-200 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCSVModal(false)}
                  className="bg-slate-100 text-slate-700 text-xs px-4 py-2 rounded-xl cursor-pointer hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCleaningCSV || !rawCSVInput.trim()}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-sm flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{isCleaningCSV ? 'Cleaning CSV with AI...' : 'Parse & Import Products'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
