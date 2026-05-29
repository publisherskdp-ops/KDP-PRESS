// app/orders/_components/columns.tsx
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ShoppingBag, Calendar } from 'lucide-react';
import { getStatusName, getStatusColor } from '../_utils/statusHelpers';

export const getColumns = (setSelectedOrder: (order: any) => void): ColumnDef<any>[] => [
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
];