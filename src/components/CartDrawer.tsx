'use client';
import React from 'react';
import { useCart } from './CartContext';
import Button from './Button';
import Link from 'next/link';

const CartDrawer: React.FC = () => {
  const { cart, isOpen, setIsOpen, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={() => setIsOpen(false)}
        style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 2000 
        }} 
      />

      {/* Drawer */}
      <div style={{ 
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '450px', maxWidth: '100%', 
        background: 'var(--surface)', borderLeft: '1px solid var(--border-medium)', zIndex: 2001,
        boxShadow: 'var(--shadow-lg, 0 10px 50px rgba(0,0,0,0.15))', display: 'flex', flexDirection: 'column',
        animation: 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <div style={{ padding: '2rem', borderBottom: '1px solid var(--border-medium)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Your Shopping Cart ({cartCount})</h2>
           <button onClick={() => setIsOpen(false)} style={{ color: 'var(--text-dim)', fontSize: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🛒</div>
              <p style={{ color: 'var(--text-dim)' }}>Your cart is empty.</p>
              <Link href="/bookstore" onClick={() => setIsOpen(false)}>
                <Button variant="outline" style={{ marginTop: '1.5rem' }}>Browse Bookstore</Button>
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                <div style={{ width: '80px', height: '120px', background: 'var(--surface-light)', borderRadius: '8px', border: '1px solid var(--border-medium)', flexShrink: 0, backgroundImage: item.image ? `url(${item.image})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem', color: 'var(--text-main)' }}>{item.title}</h4>
                  <p style={{ color: 'var(--primary-color)', fontWeight: 700, marginBottom: '0.8rem' }}>${item.price}</p>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface-elevated)', borderRadius: '8px', border: '1px solid var(--border-medium)' }}>
                      <button onClick={() => updateQuantity(item.id, -1)} style={{ padding: '0.5rem 0.8rem', color: 'var(--text-main)', background: 'transparent', border: 'none', cursor: 'pointer' }}>−</button>
                      <span style={{ padding: '0 0.5rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} style={{ padding: '0.5rem 0.8rem', color: 'var(--text-main)', background: 'transparent', border: 'none', cursor: 'pointer' }}>+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} style={{ color: 'var(--destructive, #ef4444)', fontSize: '0.8rem', fontWeight: 600, background: 'transparent', border: 'none', cursor: 'pointer' }}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: '2.5rem', borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '2rem' }}>Taxes and shipping calculated at checkout.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Link href="/checkout" onClick={() => setIsOpen(false)}>
                <Button size="lg" style={{ width: '100%', padding: '1.2rem' }}>Proceed to Checkout</Button>
              </Link>
              <Button variant="ghost" style={{ width: '100%' }} onClick={() => setIsOpen(false)}>Continue Shopping</Button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
};

export default CartDrawer;
