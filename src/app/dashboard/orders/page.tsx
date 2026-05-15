'use client';

import React, { useState, useEffect } from 'react';
import { getLuluOrdersAction } from './actions';
import { toast } from 'sonner';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

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

  const getStatusColor = (status: any) => {
    if (!status) return '#64748b'; // slate-500 default
    
    // Lulu sometimes returns status as an object { name, message, changed }
    const statusName = typeof status === 'string' ? status : (status.name || '');
    
    if (typeof statusName !== 'string') return '#64748b';

    const s = statusName.toLowerCase();
    if (s.includes('shipped') || s.includes('complete')) return '#10b981'; // emerald-500
    if (s.includes('error') || s.includes('reject')) return '#ef4444'; // red-500
    if (s.includes('pending') || s.includes('created')) return '#3b82f6'; // blue-500
    return '#64748b'; // slate-500
  };

  return (
    <div style={{ maxWidth: '1200px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-1px', marginBottom: '0.5rem' }}>
            Production Orders
          </h1>
          <p style={{ color: 'var(--text-dim)', fontWeight: 500 }}>Real-time status from Lulu Print-On-Demand</p>
        </div>
        <button 
          onClick={fetchOrders}
          disabled={loading}
          style={{
            padding: '0.8rem 1.5rem',
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <svg className={loading ? 'animate-spin' : ''} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
          Refresh Sync
        </button>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '24px',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
      }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)' }}>
            All Print Jobs ({count})
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={thStyle}>Order ID</th>
                <th style={thStyle}>Reference</th>
                <th style={thStyle}>Customer Email</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Items</th>
                <th style={thStyle}>Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '4rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', border: '3px solid #f1f5f9', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                      <p style={{ fontWeight: 600, color: 'var(--text-dim)' }}>Fetching data from Lulu API...</p>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                    No orders found in this account.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s ease' }}>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>#{order.id}</span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{order.external_id}</span>
                    </td>
                    <td style={tdStyle}>{order.contact_email}</td>
                    <td style={tdStyle}>
                      <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        padding: '0.4rem 0.8rem', 
                        borderRadius: '20px', 
                        fontSize: '0.75rem', 
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        background: `${getStatusColor(order.status)}15`,
                        color: getStatusColor(order.status),
                        border: `1px solid ${getStatusColor(order.status)}30`
                      }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: getStatusColor(order.status) }}></div>
                        {typeof order.status === 'string' ? order.status : (order.status?.name || 'UNKNOWN')}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: 600 }}>{order.line_items?.length || 0} items</span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                        {new Date(order.date_created).toLocaleDateString()}
                      </span>
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
      `}</style>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: '1.2rem 2rem',
  fontSize: '0.75rem',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  color: 'var(--text-dim)',
  borderBottom: '1px solid var(--border)'
};

const tdStyle: React.CSSProperties = {
  padding: '1.2rem 2rem',
  fontSize: '0.95rem'
};
