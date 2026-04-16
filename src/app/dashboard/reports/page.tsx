'use client';
import React, { useState } from 'react';

export default function ReportsDashboard() {
  const [storeLocation, setStoreLocation] = useState('All Stores');
  const [timeframe, setTimeframe] = useState('Last 30 Days');

  // SVG spline chart points simulation
  const splineData = "M0,150 C50,150 100,100 150,110 C200,120 250,60 300,70 C350,80 400,20 450,40 C500,60 550,130 600,90 C650,50 700,80 750,70 C800,60 850,20 900,10";
  const kenpData = "M0,180 C50,170 100,180 150,140 C200,100 250,140 300,110 C350,80 400,90 450,130 C500,170 550,150 600,100 C650,50 700,70 750,60 C800,50 850,90 900,80";

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
      
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.04em' }}>Reports (Beta)</h1>
          <p style={{ color: 'var(--text-muted)' }}>Real-time analytics across all your published titles.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select value={storeLocation} onChange={e => setStoreLocation(e.target.value)} style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'white', fontWeight: 600 }}>
            <option>All Stores</option>
            <option>Global Store (.com)</option>
            <option>UK Store (.co.uk)</option>
            <option>Canada Store (.ca)</option>
          </select>
          <select value={timeframe} onChange={e => setTimeframe(e.target.value)} style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'white', fontWeight: 600 }}>
            <option>Today</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Year to Date</option>
          </select>
        </div>
      </div>

      {/* Top Value Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Today's Estimated Royalties</p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--success)', marginBottom: '0.5rem' }}>$142.50</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600 }}>+12% vs Yesterday</p>
        </div>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Units Sold (Orders)</p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.5rem' }}>18</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>14 eBook, 4 Paperback</p>
        </div>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pages Read</p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#f59e0b', marginBottom: '0.5rem' }}>3,492</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Digital Edition Normalized Pages</p>
        </div>
      </div>

      {/* Royalties Estimator */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
        <button style={{ padding: '0.8rem 1.5rem', background: 'white', border: '1px solid var(--border-medium)', borderRadius: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          Royalties Estimator Tool
        </button>
      </div>

      {/* 30 Day Trendline Graph */}
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Orders vs Pages Read (30 Day Trend)</h3>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: 'var(--primary)' }}></div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Orders</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#f59e0b' }}></div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Pages Read</span>
            </div>
          </div>
        </div>

        {/* SVG Graph Renderer */}
        <div style={{ width: '100%', height: '300px', background: '#f8fafc', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
          {/* Grid lines */}
          <div style={{ position: 'absolute', top: '25%', width: '100%', height: '1px', background: 'var(--border)' }}></div>
          <div style={{ position: 'absolute', top: '50%', width: '100%', height: '1px', background: 'var(--border)' }}></div>
          <div style={{ position: 'absolute', top: '75%', width: '100%', height: '1px', background: 'var(--border)' }}></div>
          
          <svg width="100%" height="100%" viewBox="0 0 900 200" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0 }}>
             {/* Gradients */}
             <defs>
               <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                 <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
               </linearGradient>
             </defs>
             
             {/* Lines */}
             <path d={kenpData} fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
             <path d={`${splineData} L900,200 L0,200 Z`} fill="url(#orderGrad)" />
             <path d={splineData} fill="none" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          {/* Axes Labels */}
          <div style={{ position: 'absolute', bottom: '10px', width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0 20px', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700 }}>
             <span>Mar 01</span>
             <span>Mar 08</span>
             <span>Mar 15</span>
             <span>Mar 22</span>
             <span>Mar 30</span>
          </div>
        </div>
      </div>
      
    </div>
  );
}
