'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { logout } from '@/app/actions/auth';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const handleLogout = async () => {
    useAuthStore.getState().logout();
    await logout();
  };

  const navItems = [
    {
      name: 'Bookshelf',
      path: '/dashboard',
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      ),
    },
    {
      name: 'Orders',
      path: '/dashboard/orders',
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      ),
    },
    {
      name: 'Reports & Sales (Beta)',
      path: '/dashboard/reports',
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: 'var(--text-main)' }}>
      <aside
        style={{
          width: '260px',
          background: 'white',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          height: '100vh',
          zIndex: 50,
        }}
      >
        <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)' }}>
          <Link href="/">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <div style={{ width: '10px', height: '10px', background: 'var(--primary-color)', borderRadius: '50%' }}></div>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.5px' }}>
                KDP <span style={{ color: 'var(--primary-color)', fontWeight: 800 }}>PRESS</span>
              </span>
            </div>
          </Link>
        </div>

        <nav style={{ padding: '2rem 1rem', flex: 1 }}>
          <p
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--text-dim)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '1rem',
              paddingLeft: '1rem',
            }}
          >
            Menu
          </p>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.name}>
                  <Link href={item.path}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '0.8rem 1rem',
                        borderRadius: '12px',
                        color: isActive ? 'var(--primary-deep)' : 'var(--text-muted)',
                        background: isActive ? 'var(--primary-surface)' : 'transparent',
                        fontWeight: isActive ? 700 : 500,
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                      }}
                    >
                      <span style={{ color: isActive ? 'var(--primary-color)' : 'var(--text-dim)' }}>{item.icon}</span>
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
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary-color), var(--primary-deep))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700,
                fontSize: '1.2rem',
              }}
            >
              A
            </div>
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: 700 }}>Author Demo</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>ID: #7890</p>
            </div>
          </div>
        </div>
      </aside>

      <main style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
            height: '70px',
            background: 'white',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 3rem',
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}
        >
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <button style={{ background: 'transparent', border: 'none', position: 'relative', cursor: 'pointer' }}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--text-muted)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '8px',
                  height: '8px',
                  background: 'var(--error)',
                  borderRadius: '50%',
                }}
              ></span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: 'none',
                padding: 0,
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--text-dim)',
                cursor: 'pointer',
              }}
            >
              Sign Out
            </button>
          </div>
        </header>

        <div style={{ padding: '3rem', flex: 1, overflowY: 'auto' }}>{children}</div>
      </main>
    </div>
  );
}

