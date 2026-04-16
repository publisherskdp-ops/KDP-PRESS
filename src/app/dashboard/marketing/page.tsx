'use client';
import React, { useState } from 'react';

export default function MarketingDashboard() {
  const [promoChoice, setPromoChoice] = useState('countdown');

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
      
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.04em' }}>Marketing & Promotions</h1>
        <p style={{ color: 'var(--text-muted)' }}>Tap into our powerful marketing tools to reach more readers and boost your sales.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
        
        {/* KDP Select */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
             KDP Select
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Enroll your eBook in Publisher Select to reach more readers and earn more money. Maximize your title's potential with tools like Premium Reading.
          </p>
          <button style={{ padding: '0.8rem 1.5rem', background: 'var(--primary-darker)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)' }}>Enroll an eBook</button>
        </div>

        {/* Amazon Advertising */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
             Platform Advertising
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Promote your books across our store with Sponsored Products. You only pay when shoppers click on your ads.
          </p>
          <button style={{ padding: '0.8rem 1.5rem', background: '#fbbf24', color: '#451a03', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)' }}>Go to Ad Console</button>
        </div>
      </div>

      {/* Run a Price Promotion */}
      <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>Run a Price Promotion</h2>
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>Must be enrolled in KDP Select to run these promotions.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
           <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '1.5rem', border: promoChoice === 'countdown' ? '2px solid var(--primary)' : '1px solid var(--border-medium)', background: promoChoice === 'countdown' ? 'var(--surface-light)' : 'white', borderRadius: '12px', cursor: 'pointer' }}>
              <input type="radio" value="countdown" checked={promoChoice === 'countdown'} onChange={() => setPromoChoice('countdown')} style={{ marginTop: '0.3rem' }} />
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>Countdown Deals</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
                  Discount your book for a limited time while still earning 70% royalties. A countdown timer will show on your product page.
                </p>
              </div>
           </label>
           
           <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '1.5rem', border: promoChoice === 'free' ? '2px solid var(--primary)' : '1px solid var(--border-medium)', background: promoChoice === 'free' ? 'var(--surface-light)' : 'white', borderRadius: '12px', cursor: 'pointer' }}>
              <input type="radio" value="free" checked={promoChoice === 'free'} onChange={() => setPromoChoice('free')} style={{ marginTop: '0.3rem' }} />
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>Free Book Promotion</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
                  Offer your book for free for up to 5 days out of each 90-day Publisher Select enrollment period to boost downloads and visibility.
                </p>
              </div>
           </label>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select style={{ padding: '0.8rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'white', fontSize: '0.95rem', minWidth: '300px' }}>
            <option>Select an eligible eBook...</option>
          </select>
          <button style={{ padding: '0.8rem 2.5rem', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Create Promotion</button>
        </div>
      </div>

      {/* Nominate Your eBook */}
      <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>Nominate Your eBook (Beta)</h2>
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
               <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--primary)" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
               Featured Deals
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Nominate up to two eligible eBooks to be considered for a Featured Deal, reaching a wider audience through limited-time discounts heavily promoted on our platform.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
               Premium Reading
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Nominate your eBooks to be considered for inclusion in Premium Reading, giving our top-tier subscribers unlimited access.
            </p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select style={{ padding: '0.8rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'white', fontSize: '0.95rem', minWidth: '300px' }}>
            <option>Select an eligible eBook...</option>
          </select>
          <button style={{ padding: '0.8rem 2.5rem', background: 'var(--primary-darker)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)' }}>Check Eligibility</button>
        </div>

      </div>

    </div>
  );
}
