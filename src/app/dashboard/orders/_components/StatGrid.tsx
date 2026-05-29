// app/orders/_components/StatGrid.tsx
import React from 'react';
import { ShoppingBag, Truck, RefreshCw, AlertCircle } from 'lucide-react';

interface StatGridProps {
  stats: { total: number; shipped: number; pending: number; issues: number };
}

export default function StatGrid({ stats }: StatGridProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '4rem' }} className="stats-grid">
      <StatCard icon={<ShoppingBag size={22} />} label="Total Jobs" value={stats.total} color="var(--primary-color)" />
      <StatCard icon={<Truck size={22} />} label="Shipped" value={stats.shipped} color="#10b981" />
      <StatCard icon={<RefreshCw size={22} />} label="In Production" value={stats.pending} color="#3b82f6" />
      <StatCard icon={<AlertCircle size={22} />} label="Action Required" value={stats.issues} color="#ef4444" />
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