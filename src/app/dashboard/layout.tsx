'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Bookshelf', path: '/dashboard', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> },
    { name: 'Reports & Sales (Beta)', path: '/dashboard/reports', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg> },
    { name: 'Marketing & Promotions', path: '/dashboard/marketing', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 12H16c-.7 2-3 3-4.9 3V5c1.9 0 4.2 1 4.9 3h5.5l-2.5-3z"></path><path d="M2 12h5.5c.7-2 3-3 4.9-3v10c-1.9 0-4.2-1-4.9-3H2l2.5 3z"></path></svg> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: 'var(--text-main)' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', background: 'white', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 50 }}>
        <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)' }}>
          <Link href="/">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <div style={{ width: '10px', height: '10px', background: 'var(--primary)', borderRadius: '50%' }}></div>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.5px' }}>
                KDP <span style={{ color: 'var(--primary)', fontWeight: 800 }}>PRESS</span>
              </span>
            </div>
          </Link>
        </div>

        <nav style={{ padding: '2rem 1rem', flex: 1 }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', paddingLeft: '1rem' }}>Menu</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.name}>
                  <Link href={item.path}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '12px', padding: '0.8rem 1rem', borderRadius: '12px',
                      color: isActive ? 'var(--primary-darker)' : 'var(--text-muted)',
                      background: isActive ? 'var(--primary-surface)' : 'transparent',
                      fontWeight: isActive ? 700 : 500,
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}>
                      <span style={{ color: isActive ? 'var(--primary)' : 'var(--text-dim)' }}>{item.icon}</span>
                      {item.name}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div style={{ padding: '2rem 1.5rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--primary-deep))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.2rem' }}>
              A
            </div>
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: 700 }}>Author Demo</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>ID: #7890</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Header */}
        <header style={{ height: '70px', background: 'white', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 3rem', position: 'sticky', top: 0, zIndex: 40 }}>
          {/* <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Author Central</h2> */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <button style={{ background: 'transparent', border: 'none', position: 'relative', cursor: 'pointer' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: 'var(--error)', borderRadius: '50%' }}></span>
            </button>
            <Link href="/" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dim)' }}>Sign Out</Link>
          </div>
        </header>

        {/* Dashboard Content */}
        <div style={{ padding: '3rem', flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
