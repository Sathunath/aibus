import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from 'lucide-react';

export interface Column<T> {
  id: string;
  header: React.ReactNode;
  cell: (row: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  width?: string;
}

export interface AdminDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyText?: string;
  
  // Selection
  rowIdKey?: keyof T | ((row: T) => string | number);
  selectedIds?: Set<string | number>;
  onSelectionChange?: (selected: Set<string | number>) => void;
  
  // Row interaction
  onRowClick?: (row: T) => void;
  activeRowId?: string | number;
  activeRowClassName?: string;
  
  // Layout and styling
  className?: string;
  rowHeight?: number; // default 28px
  zebra?: boolean; // default true
  
  // Pagination
  pageSizeOptions?: number[]; // default [25, 50, 100, 250, 500, 1000]
  defaultPageSize?: number; // default 25
  
  // External pagination override
  externalPagination?: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };
}

export function AdminDataTable<T>({
  columns,
  data,
  loading = false,
  emptyText = 'No records found',
  rowIdKey,
  selectedIds,
  onSelectionChange,
  onRowClick,
  activeRowId,
  activeRowClassName = 'bg-indigo-50/70 font-semibold',
  className = '',
  rowHeight = 28,
  zebra = true,
  pageSizeOptions = [25, 50, 100, 250, 500, 1000],
  defaultPageSize = 25,
  externalPagination,
}: AdminDataTableProps<T>) {
  // Page number state for internal pagination
  const [internalPage, setInternalPage] = useState<number>(1);
  const [internalPageSize, setInternalPageSize] = useState<number>(defaultPageSize);

  // Sync internal page if defaultPageSize changes
  useEffect(() => {
    setInternalPage(1);
  }, [defaultPageSize]);

  // Determine pagination variables based on internal vs external
  const isExternal = !!externalPagination;
  const currentPage = isExternal ? externalPagination.currentPage : internalPage;
  const pageSize = isExternal ? externalPagination.pageSize : internalPageSize;
  const totalCount = isExternal ? externalPagination.totalCount : data.length;

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Auto-correct page number if out of bounds
  useEffect(() => {
    if (currentPage > totalPages) {
      if (isExternal) {
        externalPagination.onPageChange(totalPages);
      } else {
        setInternalPage(totalPages);
      }
    }
  }, [totalPages, currentPage, isExternal, externalPagination]);

  // Handle Page Changes
  const handlePageChange = (page: number) => {
    const targetPage = Math.max(1, Math.min(totalPages, page));
    if (isExternal) {
      externalPagination.onPageChange(targetPage);
    } else {
      setInternalPage(targetPage);
    }
  };

  // Handle Page Size Changes
  const handlePageSizeChange = (size: number) => {
    if (isExternal) {
      externalPagination.onPageSizeChange(size);
    } else {
      setInternalPageSize(size);
      setInternalPage(1);
    }
  };

  // Get current slice of data for rendering (if internal pagination)
  const paginatedData = useMemo(() => {
    if (isExternal) {
      return data;
    }
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [data, isExternal, currentPage, pageSize]);

  // Get Row ID helper
  const getRowId = (row: T, index: number): string | number => {
    if (rowIdKey) {
      if (typeof rowIdKey === 'function') {
        return rowIdKey(row);
      }
      return row[rowIdKey] as unknown as string | number;
    }
    // Fallback to id field if exists, otherwise index
    const candidate = (row as any).id;
    return candidate !== undefined ? candidate : index;
  };

  // Selection helpers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onSelectionChange) return;
    
    const newSelected = new Set<string | number>(selectedIds);
    if (e.target.checked) {
      // Add all rows on the current page
      paginatedData.forEach((row, idx) => {
        newSelected.add(getRowId(row, idx));
      });
    } else {
      // Remove all rows on the current page
      paginatedData.forEach((row, idx) => {
        newSelected.delete(getRowId(row, idx));
      });
    }
    onSelectionChange(newSelected);
  };

  const handleSelectRow = (e: React.ChangeEvent<HTMLInputElement>, row: T, idx: number) => {
    e.stopPropagation();
    if (!onSelectionChange) return;

    const rowId = getRowId(row, idx);
    const newSelected = new Set<string | number>(selectedIds);
    if (e.target.checked) {
      newSelected.add(rowId);
    } else {
      newSelected.delete(rowId);
    }
    onSelectionChange(newSelected);
  };

  // Is selection checked for all visible on current page?
  const isAllSelected = useMemo(() => {
    if (!selectedIds || paginatedData.length === 0) return false;
    return paginatedData.every((row, idx) => selectedIds.has(getRowId(row, idx)));
  }, [paginatedData, selectedIds]);

  // Is some but not all selected? (indeterminate)
  const isSomeSelected = useMemo(() => {
    if (!selectedIds || paginatedData.length === 0) return false;
    const count = paginatedData.filter((row, idx) => selectedIds.has(getRowId(row, idx))).length;
    return count > 0 && count < paginatedData.length;
  }, [paginatedData, selectedIds]);

  // Ref for indeterminate state on the select-all checkbox
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate = isSomeSelected;
    }
  }, [isSomeSelected]);

  // Calculate dynamic empty spaces to render placeholder rows to fill the height precisely
  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const [blankRowsCount, setBlankRowsCount] = useState<number>(0);

  useEffect(() => {
    const el = tableContainerRef.current;
    if (!el) return;

    const calculate = () => {
      const containerHeight = el.clientHeight;
      if (containerHeight <= 0) return;

      const headerHeight = 28; // height of thethead row
      const bodyAvailableHeight = containerHeight - headerHeight;
      if (bodyAvailableHeight <= 0) {
        setBlankRowsCount(0);
        return;
      }

      const visibleTotalRows = Math.floor(bodyAvailableHeight / rowHeight);
      const actualRowCount = paginatedData.length === 0 ? 1 : paginatedData.length;
      const neededBlankRows = Math.max(0, visibleTotalRows - actualRowCount);
      setBlankRowsCount(neededBlankRows);
    };

    calculate();

    const observer = new ResizeObserver(() => calculate());
    observer.observe(el);

    window.addEventListener('resize', calculate);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', calculate);
    };
  }, [paginatedData.length, rowHeight]);

  // Pagination display stats
  const fromRecord = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const toRecord = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className={`flex-1 w-full min-h-0 flex flex-col bg-white border border-slate-200 rounded-lg overflow-hidden ${className}`}>
      
      {/* Scrollable Data Area */}
      <div 
        ref={tableContainerRef} 
        className="flex-1 overflow-x-auto overflow-y-auto relative"
        style={{ minHeight: '120px' }}
      >
        <table className="w-full text-left border-collapse text-xs select-text">
          <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10 shadow-[0_1px_0_0_rgba(226,232,240,1)]">
            <tr style={{ height: '28px' }} className="text-[10px] font-bold text-slate-500 uppercase tracking-wider select-none">
              {onSelectionChange && (
                <th className="py-1 px-3 w-8 text-center">
                  <input
                    type="checkbox"
                    ref={selectAllCheckboxRef}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="w-3.5 h-3.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.id}
                  style={col.width ? { width: col.width } : undefined}
                  className={`py-1 px-3 font-semibold text-slate-500 ${col.headerClassName || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {loading ? (
              <tr style={{ height: `${rowHeight}px` }}>
                <td colSpan={columns.length + (onSelectionChange ? 1 : 0)} className="py-8 text-center text-slate-400">
                  <div className="flex items-center justify-center space-x-2 text-[11px]">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                    <span>Loading database records...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr style={{ height: `${rowHeight}px` }}>
                <td colSpan={columns.length + (onSelectionChange ? 1 : 0)} className="py-12 text-center text-slate-400">
                  <p className="text-[11px] font-semibold text-slate-500">{emptyText}</p>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => {
                const rowId = getRowId(row, idx);
                const isSelected = selectedIds?.has(rowId) || false;
                const isActive = activeRowId !== undefined && activeRowId === rowId;
                const rowBg = zebra && idx % 2 !== 0 ? 'bg-slate-50/40' : 'bg-white';
                const selectedBg = isSelected ? 'bg-indigo-50/40' : '';
                const activeBg = isActive ? activeRowClassName : '';

                return (
                  <tr
                    key={rowId}
                    style={{ height: `${rowHeight}px` }}
                    onClick={() => onRowClick?.(row)}
                    className={`hover:bg-slate-50/80 transition-colors ${onRowClick ? 'cursor-pointer' : ''} ${rowBg} ${selectedBg} ${activeBg}`}
                  >
                    {onSelectionChange && (
                      <td className="py-1 px-3 w-8 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(e, row, idx)}
                          className="w-3.5 h-3.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={`${rowId}-${col.id}`}
                        className={`py-1 px-3 truncate ${col.className || ''}`}
                      >
                        {col.cell(row, idx)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}

            {/* Placeholder Empty Rows to occupy remaining height and keep layout stable */}
            {!loading && blankRowsCount > 0 && (
              <>
                {Array.from({ length: blankRowsCount }).map((_, idx) => {
                  const startZebra = paginatedData.length;
                  const isOdd = (startZebra + idx) % 2 !== 0;
                  const bgClass = zebra && isOdd ? 'bg-slate-50/40' : 'bg-white';

                  return (
                    <tr
                      key={`blank-row-${idx}`}
                      style={{ height: `${rowHeight}px` }}
                      className={`border-b border-slate-100 pointer-events-none select-none ${bgClass}`}
                      aria-hidden="true"
                    >
                      {onSelectionChange && <td className="py-1 px-3">&nbsp;</td>}
                      {columns.map((col) => (
                        <td key={`blank-cell-${idx}-${col.id}`} className="py-1 px-3">
                          &nbsp;
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Shopify-Style Footer Navigation / Pagination */}
      <div className="h-[30px] min-h-[30px] border-t border-slate-200 bg-slate-50 flex items-center justify-between px-3 text-[11px] shrink-0 font-medium text-slate-600 select-none">
        
        {/* Left Side: Display Counts */}
        <div className="flex items-center space-x-1">
          <span>Showing</span>
          <span className="font-extrabold text-slate-950 font-mono">
            {fromRecord}–{toRecord}
          </span>
          <span>of</span>
          <span className="font-extrabold text-slate-950 font-mono">
            {totalCount.toLocaleString()}
          </span>
        </div>

        {/* Center: Rows Per Page Selector */}
        <div className="flex items-center space-x-2">
          <span className="hidden sm:inline text-slate-500">Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="h-[20px] px-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Right Side: Page Controls */}
        <div className="flex items-center space-x-1">
          {/* First Page */}
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1 || loading}
            className="w-[22px] h-[22px] flex items-center justify-center rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition cursor-pointer"
            title="First Page"
          >
            <ChevronsLeft className="w-3.5 h-3.5" />
          </button>

          {/* Prev Page */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="w-[22px] h-[22px] flex items-center justify-center rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Page Indicator */}
          <div className="px-2 font-bold text-slate-900 font-mono text-[10px]">
            {currentPage} / {totalPages}
          </div>

          {/* Next Page */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="w-[22px] h-[22px] flex items-center justify-center rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition cursor-pointer"
            title="Next Page"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Last Page */}
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages || loading}
            className="w-[22px] h-[22px] flex items-center justify-center rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition cursor-pointer"
            title="Last Page"
          >
            <ChevronsRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
