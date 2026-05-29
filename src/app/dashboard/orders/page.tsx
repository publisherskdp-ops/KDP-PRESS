// app/orders/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { getLuluOrdersAction } from '@/app/dashboard/orders/action';
import { toast } from 'sonner';
import { Search, Filter, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { flexRender, getCoreRowModel, useReactTable, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, SortingState, ColumnFiltersState, PaginationState } from '@tanstack/react-table';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

// Absolute clean modular boundaries
import { getColumns } from './_components/columns';
import { getStatusName } from './_utils/statusHelpers';
import StatGrid from './_components/StatGrid';
import OrderDetailModal from './_components/OrderDetailModal';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setCount] = useState(0); // Kept to preserve original action destructuring
  
  // Table states
  const [sorting, setSorting] = useState<SortingState>([{ id: 'date_created', desc: true }]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Pagination Fix state control mapping 
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await getLuluOrdersAction();
    if (res.success) {
      setOrders(res.orders || []);
      setCount(res.count || 0);
    } else {
      toast.error(`Failed to load orders: ${res.error}`);
    }
    setLoading(false);
  };

  // Reset pagination indexes dynamically back to page 1 whenever filter configurations change
  useEffect(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, [searchQuery, statusFilter]);

  const columns = useMemo(() => getColumns((order) => setSelectedOrder(order)), []);

  const tableColumnFilters = useMemo<ColumnFiltersState>(() => {
    if (statusFilter === 'ALL') return [];
    return [{ id: 'status', value: statusFilter }];
  }, [statusFilter]);

  const table = useReactTable({
    data: orders,
    columns,
    state: {
      sorting,
      columnFilters: tableColumnFilters,
      globalFilter: searchQuery,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const stats = useMemo(() => {
    const total = orders.length;
    const shipped = orders.filter(o => getStatusName(o.status).toLowerCase().includes('shipped')).length;
    const pending = orders.filter(o => getStatusName(o.status).toLowerCase().includes('created') || getStatusName(o.status).toLowerCase().includes('pending')).length;
    const issues = orders.filter(o => getStatusName(o.status).toLowerCase().includes('error') || getStatusName(o.status).toLowerCase().includes('reject')).length;
    return { total, shipped, pending, issues };
  }, [orders]); 

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '5rem' }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4rem' }}>
        <div>
          <h1 style={{ fontSize: '3rem', fontWeight: 950, color: 'var(--text-main)', letterSpacing: '-1.5px', marginBottom: '0.8rem', lineHeight: 1 }}>
            Production <span style={{ color: 'var(--primary-color)' }}>Pipeline</span>
          </h1>
          <p style={{ color: 'var(--text-dim)', fontWeight: 500, fontSize: '1.1rem' }}>Manage and monitor your global print-on-demand fulfillment.</p>
        </div>
        <button 
          onClick={fetchOrders}
          disabled={loading}
          style={{
            padding: '1rem 1.8rem',
            background: 'white',
            border: '1px solid var(--border-medium)',
            borderRadius: '16px',
            fontWeight: 800,
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            color: 'var(--text-main)'
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'; }}
        >
          <RefreshCw className={loading ? 'animate-spin' : ''} size={18} />
          {loading ? 'Syncing...' : 'Refresh Feed'}
        </button>
      </div>

      {/* Extracted Stats Card Grid Row */}
      <StatGrid stats={stats} />

      {/* Filters & Search Toolbar */}
      <div style={{ 
        background: 'white', 
        padding: '1.5rem', 
        borderRadius: '24px 24px 0 0', 
        border: '1px solid var(--border)',
        borderBottom: 'none',
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} size={18} />
          <input 
            type="text" 
            placeholder="Search by ID, Email, or Recipient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem 1.2rem 1rem 3.5rem',
              background: 'var(--surface-light)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              fontSize: '0.95rem',
              fontWeight: 500,
              outline: 'none',
              transition: 'all 0.2s ease',
              color: 'var(--text-main)'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <Filter size={16} style={{ color: 'var(--text-dim)' }} />
          <div style={{ display: 'flex', background: 'var(--surface-light)', padding: '0.4rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
            {['ALL', 'CREATED', 'SHIPPED', 'CANCELED', 'UNPAID'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  border: 'none',
                  background: statusFilter === s ? 'white' : 'transparent',
                  color: statusFilter === s ? 'var(--primary-color)' : 'var(--text-dim)',
                  cursor: 'pointer',
                  boxShadow: statusFilter === s ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Data Table View */}
      <div style={{
        background: 'white',
        borderRadius: '0 0 24px 24px',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0,0,0,0.04)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <Table>
            <TableHeader style={{ background: 'var(--surface-light)' }}>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  {headerGroup.headers.map(header => (
                    <TableHead 
                      key={header.id} 
                      onClick={header.column.getToggleSortingHandler()}
                      style={{ 
                        padding: '1.5rem 2rem',
                        fontSize: '0.75rem',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        color: 'var(--text-dim)',
                        cursor: header.column.getCanSort() ? 'pointer' : 'default',
                        userSelect: 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === 'asc' && <ChevronUp size={14} />}
                        {header.column.getIsSorted() === 'desc' && <ChevronDown size={14} />}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} style={{ padding: '8rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                      <div className="loader-ring"></div>
                      <p style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '1.1rem' }}>Synchronizing with Lulu Cloud...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} style={{ padding: '8rem', textAlign: 'center' }}>
                    <div style={{ opacity: 0.5, marginBottom: '1.5rem' }}>
                      <Search size={48} strokeWidth={1} />
                    </div>
                    <p style={{ fontWeight: 700, color: 'var(--text-dim)', fontSize: '1.1rem' }}>No orders match your current filters.</p>
                    <button 
                      onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); }}
                      style={{ marginTop: '1rem', background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Reset all filters
                    </button>
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map(row => (
                  <TableRow 
                    key={row.id} 
                    className="table-row" 
                    style={{ borderBottom: '1px solid #f1f5f9', transition: 'all 0.2s ease', cursor: 'default' }}
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id} style={{ padding: '1.5rem 2rem', fontSize: '0.95rem', verticalAlign: 'middle' }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Fixed Pagination Navigation Rows */}
        {!loading && table.getFilteredRowModel().rows.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.5rem 2rem',
            borderTop: '1px solid var(--border)',
            background: 'white'
          }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600 }}>
              Showing <strong style={{ color: 'var(--text-main)' }}>{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</strong> to <strong style={{ color: 'var(--text-main)' }}>{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)}</strong> of <strong style={{ color: 'var(--text-main)' }}>{table.getFilteredRowModel().rows.length}</strong> orders
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  border: '1px solid var(--border-medium)',
                  background: 'white',
                  color: 'var(--text-main)',
                  cursor: table.getCanPreviousPage() ? 'pointer' : 'default',
                  opacity: table.getCanPreviousPage() ? 1 : 0.5,
                  transition: 'all 0.2s ease'
                }}
              >
                Previous
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  border: '1px solid var(--border-medium)',
                  background: 'white',
                  color: 'var(--text-main)',
                  cursor: table.getCanNextPage() ? 'pointer' : 'default',
                  opacity: table.getCanNextPage() ? 1 : 0.5,
                  transition: 'all 0.2s ease'
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
        
        .loader-ring {
          width: 48px;
          height: 48px;
          border: 4px solid var(--surface-elevated);
          border-top-color: var(--primary-color);
          border-radius: 50%;
          animation: spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        }

        .table-row:hover {
          background-color: #fcfdfe !important;
          transform: scale(1.002);
          box-shadow: inset 4px 0 0 var(--primary-color);
        }

        .job-id-link:hover .job-id-icon {
          background-color: rgba(0, 245, 212, 0.1) !important;
          transform: scale(1.05);
        }
        
        .job-id-link:hover span {
          color: var(--primary-hover, var(--primary-color)) !important;
          text-decoration: underline !important;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      {/* Extracted Self-Contained Overlay Modal Component */}
      {selectedOrder && (
        <OrderDetailModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
}