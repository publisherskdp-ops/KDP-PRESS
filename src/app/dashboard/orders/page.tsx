'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { getLuluOrdersAction } from './actions';
import { toast } from 'sonner';
import { Search, Filter, RefreshCw, ChevronDown, ShoppingBag, Truck, AlertCircle, Calendar } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

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

  // Filtered and searched orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const statusName = getStatusName(order.status);
      const matchesStatus = statusFilter === 'ALL' || statusName.toUpperCase() === statusFilter.toUpperCase();
      const matchesSearch = 
        order.id.toString().includes(searchQuery) || 
        order.contact_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.external_id && order.external_id.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesStatus && matchesSearch;
    });
  }, [orders, searchQuery, statusFilter]);

  // Stats
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
            placeholder="Search by ID, Email, or Reference..."
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
              transition: 'all 0.2s ease'
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
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--surface-light)' }}>
                <th style={thStyle}>Lulu Job ID</th>
                <th style={thStyle}>External ID</th>
                <th style={thStyle}>Recipient</th>
                <th style={thStyle}>Fulfillment Status</th>
                <th style={thStyle}>Asset Count</th>
                <th style={thStyle}>Date Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '8rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                      <div className="loader-ring"></div>
                      <p style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '1.1rem' }}>Synchronizing with Lulu Cloud...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '8rem', textAlign: 'center' }}>
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
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="table-row" style={{ borderBottom: '1px solid #f1f5f9', transition: 'all 0.2s ease' }}>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', background: 'var(--surface-light)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
                          <ShoppingBag size={14} />
                        </div>
                        <span style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1rem' }}>#{order.id}</span>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'monospace', background: '#f8fafc', padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        {order.external_id || 'manual-entry'}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{order.shipping_address?.name || 'Guest'}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{order.contact_email}</span>
                      </div>
                    </td>
                    <td style={tdStyle}>
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
                        background: `${getStatusColor(order.status)}12`,
                        color: getStatusColor(order.status),
                        border: `1px solid ${getStatusColor(order.status)}25`
                      }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: getStatusColor(order.status) }}></div>
                        {getStatusName(order.status)}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ height: '6px', width: '40px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: '100%', background: 'var(--primary-color)' }}></div>
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{order.line_items?.length || 0} Assets</span>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)' }}>
                        <Calendar size={14} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                          {new Date(order.date_created).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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

        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
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

const thStyle: React.CSSProperties = {
  padding: '1.5rem 2rem',
  fontSize: '0.75rem',
  fontWeight: 900,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  color: 'var(--text-dim)',
  borderBottom: '1px solid var(--border)'
};

const tdStyle: React.CSSProperties = {
  padding: '1.5rem 2rem',
  fontSize: '0.95rem',
  verticalAlign: 'middle'
};
