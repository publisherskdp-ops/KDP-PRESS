// app/orders/_components/OrderDetailModal.tsx
'use client';

import React, { useState } from 'react';
import { X, AlertCircle, MapPin, Package, FileText, ExternalLink, Copy, Check, TrendingUp } from 'lucide-react';
import ProfitCalculationTab from '@/components/ProfitCalculationTab';
import { getStatusName, getStatusColor, getRejectionReasons } from '../_utils/statusHelpers';

interface OrderDetailModalProps {
  order: any;
  onClose: () => void;
}

export default function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const [copied, setCopied] = useState(false);
  const [modalTab, setModalTab] = useState<'overview' | 'profit' | 'json'>('overview');

  const handleCopyJson = () => {
    if (!order) return;
    navigator.clipboard.writeText(JSON.stringify(order, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusColor = getStatusColor(order.status);
  const statusName = getStatusName(order.status);
  const rejectionReasons = getRejectionReasons(order);
  console.log('Order Details Modal Rendered with Order:', order);

  return (
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
      onClick={onClose}
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
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
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
                background: `${statusColor}12`,
                color: statusColor,
                border: `1px solid ${statusColor}25`
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor }}></div>
                {statusName}
              </div>
            </div>
            <p style={{ margin: 0, color: 'var(--text-dim)', fontSize: '0.9rem', fontWeight: 600 }}>
              Lulu Job ID: <span style={{ fontFamily: 'monospace', color: 'var(--text-main)', fontWeight: 800 }}>#{order.id}</span>
              <span style={{ margin: '0 10px', color: 'var(--border)' }}>|</span>
              Reference ID: <span style={{ fontFamily: 'monospace', color: 'var(--text-main)', fontWeight: 800 }}>{order.external_id || 'N/A'}</span>
            </p>

            {/* Tabs Navigation */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              marginTop: '1.5rem',
              borderBottom: '2px solid var(--border)',
              paddingBottom: 0
            }}>
              {[
                { id: 'overview', label: 'Overview', icon: Package },
                { id: 'profit', label: 'Profit Analysis', icon: TrendingUp },
                { id: 'json', label: 'Raw Data', icon: FileText }
              ].map(tab => {
                const isActive = modalTab === tab.id;
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setModalTab(tab.id as any)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '0.75rem 1rem',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      color: isActive ? 'var(--primary-color)' : 'var(--text-dim)',
                      borderBottom: isActive ? '2px solid var(--primary-color)' : '2px solid transparent',
                      marginBottom: '-2px',
                      transition: 'all 0.2s ease',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                    onMouseOver={(e) => !isActive && (e.currentTarget.style.color = 'var(--text-main)')}
                    onMouseOut={(e) => !isActive && (e.currentTarget.style.color = 'var(--text-dim)')}
                  >
                    <TabIcon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
          <button 
            onClick={onClose}
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
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              flexShrink: 0,
              marginLeft: '1rem'
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
          maxHeight: 'calc(90vh - 200px)'
        }}>
          
          {/* OVERVIEW TAB */}
          {modalTab === 'overview' && (
            <>
              {/* REJECTION / ERROR CALLOUT */}
              {(statusName.toUpperCase() === 'REJECTED' || 
                statusName.toUpperCase() === 'ERROR' || 
                rejectionReasons.length > 0) && (
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
                    {rejectionReasons.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-main)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                        {rejectionReasons.map((reason, idx) => (
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
                    {order.contact_email || 'N/A'}
                  </span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.3rem' }}>
                    Shipping Level
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', textTransform: 'uppercase' }}>
                    {order.shipping_level || 'N/A'}
                  </span>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.3rem' }}>
                    Date Created
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                    {new Date(order.date_created).toLocaleString('en-US', { 
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
                {order.shipping_address ? (
                  <div style={{ 
                    border: '1px solid var(--border)', 
                    borderRadius: '16px', 
                    padding: '1.25rem',
                    background: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
                  }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: 800, fontSize: '1rem' }}>
                      {order.shipping_address.name}
                    </p>
                    <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-dim)', fontWeight: 500, fontSize: '0.9rem' }}>
                      {order.shipping_address.street1}
                    </p>
                    {order.shipping_address.street2 && (
                      <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-dim)', fontWeight: 500, fontSize: '0.9rem' }}>
                        {order.shipping_address.street2}
                      </p>
                    )}
                    <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-dim)', fontWeight: 500, fontSize: '0.9rem' }}>
                      {order.shipping_address.city}, {order.shipping_address.state_code || order.shipping_address.state} {order.shipping_address.postcode}
                    </p>
                    <div style={{ display: 'flex', gap: '15px', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        Country: <strong style={{ color: 'var(--text-main)' }}>{order.shipping_address.country_code || order.shipping_address.country}</strong>
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        Phone: <strong style={{ color: 'var(--text-main)' }}>{order.shipping_address.phone_number || 'N/A'}</strong>
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
                {order.line_items && order.line_items.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {order.line_items.map((item: any, idx: number) => {
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
            </>
          )}

          {/* PROFIT TAB */}
          {modalTab === 'profit' && (
            <ProfitCalculationTab order={order} />
          )}

          {/* RAW JSON TAB */}
          {modalTab === 'json' && (
            <div style={{ border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ 
                borderTop: '1px solid var(--border)', 
                position: 'relative',
                background: '#0f172a'
              }}>
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
                    {JSON.stringify(order, null, 2)}
                  </code>
                </pre>
              </div>
            </div>
          )}

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
            onClick={onClose}
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
  );
}