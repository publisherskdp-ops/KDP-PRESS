'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { getLuluOrdersAction } from './actions';
import { toast } from 'sonner';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  ChevronDown, 
  ShoppingBag, 
  Truck, 
  AlertCircle, 
  Calendar, 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  FileText, 
  MapPin, 
  Package,
  ChevronUp
} from 'lucide-react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  
  // Table states
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'date_created', desc: true }
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showRawJson, setShowRawJson] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (selectedOrder) {
      setShowRawJson(false);
      setCopied(false);
    }
  }, [selectedOrder]);

  const handleCopyJson = () => {
    if (!selectedOrder) return;
    navigator.clipboard.writeText(JSON.stringify(selectedOrder, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRejectionReasons = (order: any): string[] => {
    const reasons: string[] = [];
    if (!order) return reasons;
    
    // 1. Check status object fields
    if (order.status && typeof order.status === 'object') {
      if (order.status.message) {
        reasons.push(order.status.message);
      }
      if (Array.isArray(order.status.errors)) {
        order.status.errors.forEach((err: any) => {
          if (typeof err === 'string') {
            reasons.push(err);
          } else if (err && typeof err === 'object') {
            if (err.message) {
              reasons.push(err.message);
            } else if (err.msg) {
              reasons.push(err.msg);
            } else {
              reasons.push(JSON.stringify(err));
            }
          }
        });
      }
    }
    
    // 2. Check top-level error property
    if (order.error) {
      if (typeof order.error === 'string') {
        reasons.push(order.error);
      } else if (typeof order.error === 'object') {
        if (order.error.message) reasons.push(order.error.message);
        if (order.error.detail) reasons.push(JSON.stringify(order.error.detail));
      }
    }
    
    // 3. Check line items for errors/normalization messages
    if (order.line_items && Array.isArray(order.line_items)) {
      order.line_items.forEach((item: any, idx: number) => {
        const itemTitle = item.title || `Item ${idx + 1}`;
        const printableNorm = item.printable_normalization;
        if (printableNorm) {
          if (Array.isArray(printableNorm.detail)) {
            printableNorm.detail.forEach((d: any) => {
              if (d.msg) reasons.push(`[${itemTitle}] ${d.msg}`);
            });
          }
          const nestedNorm = printableNorm.printable_normalization;
          if (nestedNorm && Array.isArray(nestedNorm.detail)) {
            nestedNorm.detail.forEach((d: any) => {
              if (d.msg) reasons.push(`[${itemTitle}] ${d.msg}`);
            });
          }
        }
      });
    }
    
    return reasons;
  };

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

  const getStatusName = (status: any) => {
    if (!status) return 'UNKNOWN';
    return typeof status === 'string' ? status : (status.name || 'UNKNOWN');
  };

  const getStatusColor = (status: any) => {
    const s = getStatusName(status).toLowerCase();
    if (s.includes('shipped') || s.includes('complete')) return '#10b981'; // emerald-500
    if (s.includes('error') || s.includes('reject') || s.includes('canceled')) return '#ef4444'; // red-500
    if (s.includes('unpaid')) return '#f59e0b'; // amber-500
    if (s.includes('pending') || s.includes('created')) return '#3b82f6'; // blue-500
    return '#64748b'; // slate-500
  };

  // Tanstack columns configuration
  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: 'id',
      header: 'Lulu Job ID',
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div 
            onClick={() => setSelectedOrder(order)}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            className="job-id-link"
          >
            <div style={{ 
              width: '32px', height: '32px', background: 'var(--surface-light)', 
              borderRadius: '8px', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', color: 'var(--primary-color)', 
              transition: 'all 0.2s ease' 
            }} className="job-id-icon">
              <ShoppingBag size={14} />
            </div>
            <span style={{ fontWeight: 800, color: 'var(--primary-color)', fontSize: '1.05rem', textDecoration: 'underline dotted' }}>
              #{order.id}
            </span>
          </div>
        );
      }
    },
    {
      accessorKey: 'external_id',
      header: 'External ID',
      cell: ({ row }) => (
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'monospace', background: '#f8fafc', padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          {row.getValue('external_id') || 'manual-entry'}
        </span>
      )
    },
    {
      id: 'recipient',
      header: 'Recipient',
      accessorFn: (row) => `${row.shipping_address?.name || 'Guest'} ${row.contact_email || ''}`,
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{order.shipping_address?.name || 'Guest'}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{order.contact_email || '—'}</span>
          </div>
        );
      }
    },
    {
      accessorKey: 'status',
      header: 'Fulfillment Status',
      accessorFn: (row) => getStatusName(row.status),
      cell: ({ row }) => {
        const status = row.getValue('status');
        const color = getStatusColor(status);
        return (
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '0.5rem 1rem', 
            borderRadius: '12px', 
            fontSize: '0.75rem', 
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            background: `${color}12`,
            color: color,
            border: `1px solid ${color}25`
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }}></div>
            {status as string}
          </div>
        );
      }
    },
    {
      id: 'assets',
      header: 'Asset Count',
      accessorFn: (row) => row.line_items?.length || 0,
      cell: ({ row }) => {
        const count = row.original.line_items?.length || 0;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ height: '6px', width: '40px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: count > 0 ? '100%' : '0%', background: 'var(--primary-color)' }}></div>
            </div>
            <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{count} {count === 1 ? 'Asset' : 'Assets'}</span>
          </div>
        );
      }
    },
    {
      accessorKey: 'date_created',
      header: 'Date Created',
      cell: ({ row }) => {
        const date = new Date(row.getValue('date_created'));
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)' }}>
            <Calendar size={14} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        );
      }
    }
  ], []);

  // Update table filter when searchQuery changes
  const globalFilter = searchQuery;

  // Update table filter when statusFilter changes
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
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10
      }
    }
  });

  // Calculate stats based on orders list
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

      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '4rem' }}>
        <StatCard icon={<ShoppingBag size={22} />} label="Total Jobs" value={stats.total} color="var(--primary-color)" />
        <StatCard icon={<Truck size={22} />} label="Shipped" value={stats.shipped} color="#10b981" />
        <StatCard icon={<RefreshCw size={22} />} label="In Production" value={stats.pending} color="#3b82f6" />
        <StatCard icon={<AlertCircle size={22} />} label="Action Required" value={stats.issues} color="#ef4444" />
      </div>

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
        {/* Search */}
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

        {/* Status Filter */}
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

      {/* Main Data Table */}
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
        
        {/* Pagination Controls */}
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

      {/* Detail Modal */}
      {selectedOrder && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem',
            animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div 
            style={{
              background: 'white',
              width: '100%',
              maxWidth: '850px',
              maxHeight: '90vh',
              borderRadius: '28px',
              border: '1px solid var(--border-medium)',
              boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              animation: 'scaleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
              color: 'var(--text-main)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '2rem',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              background: 'var(--surface-light)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.5rem' }}>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 950, letterSpacing: '-0.5px', margin: 0 }}>
                    Job Details
                  </h2>
                  <div style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    padding: '0.4rem 0.8rem', 
                    borderRadius: '10px', 
                    fontSize: '0.75rem', 
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    background: `${getStatusColor(selectedOrder.status)}12`,
                    color: getStatusColor(selectedOrder.status),
                    border: `1px solid ${getStatusColor(selectedOrder.status)}25`
                  }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: getStatusColor(selectedOrder.status) }}></div>
                    {getStatusName(selectedOrder.status)}
                  </div>
                </div>
                <p style={{ margin: 0, color: 'var(--text-dim)', fontSize: '0.9rem', fontWeight: 600 }}>
                  Lulu Job ID: <span style={{ fontFamily: 'monospace', color: 'var(--text-main)', fontWeight: 800 }}>#{selectedOrder.id}</span>
                  <span style={{ margin: '0 10px', color: 'var(--border)' }}>|</span>
                  Reference ID: <span style={{ fontFamily: 'monospace', color: 'var(--text-main)', fontWeight: 800 }}>{selectedOrder.external_id || 'N/A'}</span>
                </p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                style={{
                  border: '1px solid var(--border)',
                  background: 'white',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-dim)',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.background = '#f1f5f9'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'white'; }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ 
              padding: '2rem', 
              overflowY: 'auto', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '2rem',
              maxHeight: 'calc(90vh - 120px)'
            }}>
              
              {/* REJECTION / ERROR CALLOUT */}
              {(getStatusName(selectedOrder.status).toUpperCase() === 'REJECTED' || 
                getStatusName(selectedOrder.status).toUpperCase() === 'ERROR' || 
                getRejectionReasons(selectedOrder).length > 0) && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.06)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start'
                }}>
                  <AlertCircle size={22} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#ef4444', fontWeight: 900, fontSize: '1.05rem', letterSpacing: '-0.2px' }}>
                      Fulfillment Error / Rejection Reasons
                    </h3>
                    {getRejectionReasons(selectedOrder).length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-main)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                        {getRejectionReasons(selectedOrder).map((reason, idx) => (
                          <li key={idx} style={{ marginBottom: '0.25rem', fontWeight: 600 }}>{reason}</li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ margin: 0, color: 'var(--text-dim)', fontSize: '0.92rem', fontWeight: 600 }}>
                        This print job was rejected or returned an error status from the Lulu API. No specific error reasons were returned in the payload. Check the raw API response below for further debugging.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Order Overview Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1.5rem',
                background: 'var(--surface-light)',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid var(--border)'
              }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.3rem' }}>
                    Contact Email
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                    {selectedOrder.contact_email || 'N/A'}
                  </span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.3rem' }}>
                    Shipping Level
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', textTransform: 'uppercase' }}>
                    {selectedOrder.shipping_level || 'N/A'}
                  </span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.3rem' }}>
                    Date Created
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                    {new Date(selectedOrder.date_created).toLocaleString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', marginTop: 0 }}>
                  <MapPin size={18} style={{ color: 'var(--primary-color)' }} />
                  Shipping Address
                </h3>
                {selectedOrder.shipping_address ? (
                  <div style={{ 
                    border: '1px solid var(--border)', 
                    borderRadius: '16px', 
                    padding: '1.25rem',
                    background: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
                  }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: 800, fontSize: '1rem' }}>
                      {selectedOrder.shipping_address.name}
                    </p>
                    <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-dim)', fontWeight: 500, fontSize: '0.9rem' }}>
                      {selectedOrder.shipping_address.street1}
                    </p>
                    {selectedOrder.shipping_address.street2 && (
                      <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-dim)', fontWeight: 500, fontSize: '0.9rem' }}>
                        {selectedOrder.shipping_address.street2}
                      </p>
                    )}
                    <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-dim)', fontWeight: 500, fontSize: '0.9rem' }}>
                      {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state_code || selectedOrder.shipping_address.state} {selectedOrder.shipping_address.postcode}
                    </p>
                    <div style={{ display: 'flex', gap: '15px', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        Country: <strong style={{ color: 'var(--text-main)' }}>{selectedOrder.shipping_address.country_code || selectedOrder.shipping_address.country}</strong>
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        Phone: <strong style={{ color: 'var(--text-main)' }}>{selectedOrder.shipping_address.phone_number || 'N/A'}</strong>
                      </span>
                    </div>
                  </div>
                ) : (
                  <p style={{ margin: 0, color: 'var(--text-dim)', fontSize: '0.9rem', fontStyle: 'italic' }}>No shipping address provided.</p>
                )}
              </div>

              {/* Line Items / Assets */}
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', marginTop: 0 }}>
                  <Package size={18} style={{ color: 'var(--primary-color)' }} />
                  Line Items & Print Assets
                </h3>
                {selectedOrder.line_items && selectedOrder.line_items.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {selectedOrder.line_items.map((item: any, idx: number) => {
                      const coverUrl = item.printable_normalization?.cover?.source_url || 
                                       item.printable_normalization?.printable_normalization?.cover?.source_url;
                      const interiorUrl = item.printable_normalization?.interior?.source_url || 
                                          item.printable_normalization?.printable_normalization?.interior?.source_url;
                      const podId = item.printable_normalization?.pod_package_id || 
                                    item.printable_normalization?.printable_normalization?.pod_package_id;
                      
                      return (
                        <div key={item.id || idx} style={{ 
                          border: '1px solid var(--border)', 
                          borderRadius: '16px', 
                          padding: '1.25rem',
                          background: 'white',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1rem',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                            <div>
                              <h4 style={{ margin: '0 0 0.25rem 0', fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                                {item.title || 'Untitled Book Asset'}
                              </h4>
                              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                                POD Package ID: <code style={{ color: 'var(--text-main)', background: 'var(--surface-light)', padding: '0.2rem 0.4rem', borderRadius: '4px', border: '1px solid var(--border)' }}>{podId || 'N/A'}</code>
                              </p>
                            </div>
                            <div style={{ background: 'var(--surface-light)', border: '1px solid var(--border)', borderRadius: '10px', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Qty:</span>
                              <strong style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--primary-color)' }}>{item.quantity || 1}</strong>
                            </div>
                          </div>

                          {/* Asset Links */}
                          <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: '1fr 1fr', 
                            gap: '1rem',
                            background: '#f8fafc',
                            padding: '1rem',
                            borderRadius: '12px',
                            border: '1px solid #f1f5f9'
                          }}>
                            <div>
                              <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>
                                Cover PDF (Source File)
                              </span>
                              {coverUrl ? (
                                <a 
                                  href={coverUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '0.82rem',
                                    color: 'var(--primary-color)',
                                    fontWeight: 700,
                                    textDecoration: 'none'
                                  }}
                                  onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                                  onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
                                >
                                  <FileText size={14} />
                                  Download Cover
                                  <ExternalLink size={12} />
                                </a>
                              ) : (
                                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Not provided</span>
                              )}
                            </div>

                            <div>
                              <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>
                                Manuscript PDF (Source File)
                              </span>
                              {interiorUrl ? (
                                <a 
                                  href={interiorUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '0.82rem',
                                    color: 'var(--primary-color)',
                                    fontWeight: 700,
                                    textDecoration: 'none'
                                  }}
                                  onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                                  onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
                                >
                                  <FileText size={14} />
                                  Download Manuscript
                                  <ExternalLink size={12} />
                                </a>
                              ) : (
                                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Not provided</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ margin: 0, color: 'var(--text-dim)', fontSize: '0.9rem', fontStyle: 'italic' }}>No line items or assets found.</p>
                )}
              </div>

              {/* Collapsible Accordion for RAW API JSON Response */}
              <div style={{ border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
                <button
                  onClick={() => setShowRawJson(!showRawJson)}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    background: 'var(--surface-light)',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-main)',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--border)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-light)'}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={16} style={{ color: 'var(--primary-color)' }} />
                    Raw API JSON Payload & Response
                  </span>
                  <ChevronDown 
                    size={18} 
                    style={{ 
                      transform: showRawJson ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                      color: 'var(--text-dim)'
                    }} 
                  />
                </button>

                {showRawJson && (
                  <div style={{ 
                    borderTop: '1px solid var(--border)', 
                    position: 'relative',
                    background: '#0f172a'
                  }}>
                    {/* Copy Button */}
                    <button
                      onClick={handleCopyJson}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '8px',
                        color: 'white',
                        padding: '0.5rem 0.8rem',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease',
                        backdropFilter: 'blur(4px)',
                        zIndex: 10
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                    >
                      {copied ? (
                        <>
                          <Check size={12} style={{ color: '#10b981' }} />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          Copy JSON
                        </>
                      )}
                    </button>

                    <pre style={{
                      margin: 0,
                      padding: '1.5rem',
                      maxHeight: '350px',
                      overflow: 'auto',
                      fontSize: '0.85rem',
                      fontFamily: 'Consolas, Monaco, Lucida Console, monospace',
                      color: '#cbd5e1',
                      lineHeight: '1.5',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all'
                    }}>
                      <code>
                        {JSON.stringify(selectedOrder, null, 2)}
                      </code>
                    </pre>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1.5rem 2rem',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'flex-end',
              background: 'var(--surface-light)'
            }}>
              <button 
                onClick={() => setSelectedOrder(null)}
                style={{
                  padding: '0.8rem 1.8rem',
                  background: 'white',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  color: 'var(--text-main)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.06)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.02)'; }}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number | string, color: string }) {
  return (
    <div style={{
      background: 'white',
      padding: '1.8rem',
      borderRadius: '24px',
      border: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
      transition: 'all 0.3s ease'
    }}
    onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = color + '40'; }}
    onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      <div style={{ 
        width: '56px', height: '56px', borderRadius: '16px', background: color + '10', 
        color: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.3rem' }}>{label}</p>
        <p style={{ fontSize: '1.8rem', fontWeight: 950, color: 'var(--text-main)', lineHeight: 1 }}>{value}</p>
      </div>
    </div>
  );
}
