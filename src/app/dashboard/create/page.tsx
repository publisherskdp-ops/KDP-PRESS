import React from 'react';
import Link from 'next/link';

export default function CreateInterstitial() {
  const options = [
    {
      title: 'eBook',
      desc: 'Publish digitally to e-readers, tablets, and other hand-held devices. Includes comics and manga.',
      href: '/dashboard/publish-ebook',
      icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="8" y1="10" x2="16" y2="10"></line><line x1="8" y1="14" x2="16" y2="14"></line><line x1="8" y1="18" x2="12" y2="18"></line></svg>,
      badge: null
    },
    {
      title: 'Paperback',
      desc: 'Make your title available in print and ship around the world.',
      href: '/dashboard/publish',
      icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>,
      badge: null
    },
    {
      title: 'Hardcover',
      desc: 'Bind your book in hardcover and ship around the world.',
      href: '/dashboard/publish',
      icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>,
      badge: null
    },
    {
      title: 'Series page',
      desc: 'Collect your books together and build a single, unified Series page.',
      href: '/dashboard',
      icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
      badge: 'Coming Soon'
    }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '2rem' }}>
      <Link href="/dashboard">
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '1.5rem' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Back to Bookshelf
        </span>
      </Link>

      <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.04em' }}>What would you like to create?</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Pick an option and we'll get you started. You can save your progress as you go.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
        {options.map((opt, i) => (
          <div key={i} style={{
            background: 'white', borderRadius: '16px', border: '1px solid var(--border)',
            padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column',
            alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
            position: 'relative', opacity: opt.badge ? 0.7 : 1
          }}>
            {opt.badge && (
              <span style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.25rem 0.7rem', background: '#f1f5f9', border: '1px solid var(--border-medium)', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)' }}>
                {opt.badge}
              </span>
            )}
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--surface-light)', color: 'var(--primary-darker)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              {opt.icon}
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.8rem' }}>{opt.title}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem', flex: 1 }}>{opt.desc}</p>

            <Link href={opt.href} style={{ width: '100%' }}>
              <button disabled={!!opt.badge} style={{
                padding: '0.8rem 2rem',
                background: opt.badge ? '#e2e8f0' : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                color: opt.badge ? 'var(--text-dim)' : '#451a03', border: 'none', borderRadius: '100px',
                fontSize: '0.95rem', fontWeight: 800,
                cursor: opt.badge ? 'not-allowed' : 'pointer', width: '100%',
                boxShadow: opt.badge ? 'none' : '0 4px 12px rgba(245, 158, 11, 0.2)'
              }}>
                {opt.badge ? opt.badge : `Create ${opt.title.toLowerCase().replace(' page', '')}`}
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
