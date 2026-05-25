'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Button from '@/components/Button';
import Link from 'next/link';

function OrderStatusContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const error = searchParams.get('error');
  const jobId = searchParams.get('jobId');
  const externalId = searchParams.get('externalId');

  const isSuccess = status === 'success';

  return (
    <div className="container" style={{ maxWidth: '800px', paddingTop: '10rem', paddingBottom: '10rem' }}>
      <div style={{
        background: 'var(--surface-light)',
        padding: '4rem',
        borderRadius: '32px',
        border: '1px solid var(--border-medium)',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        {isSuccess ? (
          <>
            <div style={{
              width: '100px', height: '100px', background: 'rgba(0, 245, 212, 0.1)', color: 'var(--success)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 2.5rem', border: '2px solid var(--success)'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.5rem', color: 'var(--text-main)' }}>Order Confirmed!</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
              Your story is on its way. We've successfully processed your order with Lulu Print-On-Demand.
            </p>
            
            <div style={{ 
              background: 'var(--surface)', 
              padding: '2rem', 
              borderRadius: '16px', 
              marginBottom: '3rem',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem',
              textAlign: 'left',
              border: '1px solid var(--border)'
            }}>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Lulu Job ID</p>
                <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>#{jobId || 'N/A'}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Reference ID</p>
                <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{externalId || 'N/A'}</p>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '3rem' }}>
              A confirmation email has been sent. You can track your order status using the Lulu Job ID.
            </p>
          </>
        ) : (
          <>
            <div style={{
              width: '100px', height: '100px', background: 'rgba(255, 77, 77, 0.1)', color: '#ff4d4d',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 2.5rem', border: '2px solid #ff4d4d'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            </div>
            <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.5rem', color: 'var(--text-main)' }}>Order Failed</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
              We encountered an issue while processing your order with our print partner.
            </p>
            
            <div style={{ 
              background: 'rgba(255, 77, 77, 0.05)', 
              padding: '2rem', 
              borderRadius: '16px', 
              marginBottom: '3rem',
              textAlign: 'left',
              border: '1px solid rgba(255, 77, 77, 0.2)'
            }}>
              <p style={{ fontSize: '0.8rem', color: '#ff4d4d', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem', fontWeight: 700 }}>Error Details</p>
              <div style={{ fontWeight: 500, fontSize: '1rem', color: 'var(--text-main)', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {error?.split('\n').map((line: string, idx: number) => (
                  <div key={idx}>{line || '\u200b'}</div>
                )) || 'An unknown error occurred. Please contact support.'}
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '3rem' }}>
              Don't worry, if your payment was processed, we will manually review this and ensure your order is placed.
            </p>
          </>
        )}

        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          <Link href="/bookstore"><Button size="lg">Return to Store</Button></Link>
          {!isSuccess && <Link href="/checkout"><Button variant="outline" size="lg">Try Again</Button></Link>}
          {isSuccess && <Link href="/"><Button variant="outline" size="lg">Back to Home</Button></Link>}
        </div>
      </div>
    </div>
  );
}

export default function OrderStatusPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--surface)', color: 'var(--text-main)' }}>
      <Header />
      <Suspense fallback={
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <p>Loading order details...</p>
        </div>
      }>
        <OrderStatusContent />
      </Suspense>
    </main>
  );
}
