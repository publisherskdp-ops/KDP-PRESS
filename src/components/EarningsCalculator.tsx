'use client';
import React, { useState } from 'react';

const EarningsCalculator = () => {
  const [sales, setSales] = useState(1000);
  const [price, setPrice] = useState(9.99);
  const royaltyRate = 0.7; // 70%
  const earnings = (sales * price * royaltyRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div style={{ 
      background: 'var(--surface-card)',
      backdropFilter: 'blur(20px)',
      borderRadius: '28px', 
      padding: '3rem', 
      border: '1px solid var(--border-medium)',
      boxShadow: 'var(--shadow-blue)',
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <div style={{ marginBottom: '2.5rem' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Monthly Sales</span>
            <span style={{ color: 'var(--primary)', fontSize: '1.3rem', fontWeight: 900 }}>{sales.toLocaleString()} <span style={{fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600}}>Copies</span></span>
         </div>
         <input 
            type="range" 
            min="100" 
            max="10000" 
            step="100" 
            value={sales} 
            onChange={(e) => setSales(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer', height: '5px' }}
         />
      </div>

      <div style={{ marginBottom: '3rem' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Book Price</span>
            <span style={{ color: 'var(--primary)', fontSize: '1.3rem', fontWeight: 900 }}>${price.toFixed(2)}</span>
         </div>
         <input 
            type="range" 
            min="0.99" 
            max="29.99" 
            step="1.00" 
            value={price} 
            onChange={(e) => setPrice(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer', height: '5px' }}
         />
      </div>

      <div style={{ background: 'var(--surface-light)', borderRadius: '20px', padding: '2.5rem', textAlign: 'center' }}>
         <p style={{ color: 'var(--text-dim)', marginBottom: '0.8rem', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '2px' }}>Your 70% Royalties Estimate</p>
         <h2 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-3px', color: 'var(--primary-deep)' }}>${earnings}</h2>
         <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '0.8rem' }}>Based on worldwide distribution on KDP Press</p>
      </div>
    </div>
  );
};

export default EarningsCalculator;
