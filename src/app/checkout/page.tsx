'use client';
import React, { useState } from 'react';
import Header from '@/components/Header';
import Button from '@/components/Button';
import { useCart } from '@/components/CartContext';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Billing, 3: Payment, 4: Success
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [shippingMethod, setShippingMethod] = useState('standard');

  if (cart.length === 0 && step !== 4) {
    return (
      <main style={{ minHeight: '100vh', background: 'var(--surface)', color: 'var(--text-main)' }}>
        <Header />
        <div className="section container" style={{ paddingTop: '12rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Your Cart is Empty</h1>
          <Link href="/bookstore"><Button size="lg">Explore Bookstore</Button></Link>
        </div>
      </main>
    );
  }

  const shipping = shippingMethod === 'express' ? 12.99 : shippingMethod === 'overnight' ? 24.99 : 4.99;
  const tax = cartTotal * 0.08;
  const grandTotal = cartTotal + shipping + tax;

  return (
    <main style={{ minHeight: '100vh', background: 'var(--surface)', color: 'var(--text-main)' }}>
      <Header />
      
      <div className="section" style={{ paddingTop: '10rem' }}>
        <div className="container" style={{ maxWidth: '1100px' }}>
          
          {/* Progress Indicator */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0', marginBottom: '6rem' }}>
            <ProgressStep number={1} label="Shipping" active={step >= 1} done={step > 1} />
            <ProgressLine active={step > 1} />
            <ProgressStep number={2} label="Billing" active={step >= 2} done={step > 2} />
            <ProgressLine active={step > 2} />
            <ProgressStep number={3} label="Payment" active={step >= 3} done={step > 3} />
            <ProgressLine active={step > 3} />
            <ProgressStep number={4} label="Confirmed" active={step >= 4} done={false} />
          </div>

          {/* STEP 1: Shipping */}
          {step === 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '4rem', alignItems: 'start' }}>
              <div style={{ background: 'var(--surface)', padding: '3.5rem', borderRadius: '32px', border: '1px solid var(--border)' }}>
                <SectionTitle icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                } title="Shipping Address" />
                
                <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Input label="First Name *" placeholder="John" id="ship-first" />
                    <Input label="Last Name *" placeholder="Rivers" id="ship-last" />
                  </div>
                  <Input label="Email Address *" placeholder="john@example.com" id="ship-email" type="email" />
                  <Input label="Phone Number" placeholder="+1 (555) 000-0000" id="ship-phone" type="tel" />
                  <Input label="Address Line 1 *" placeholder="123 Publishing Way" id="ship-addr1" />
                  <Input label="Address Line 2" placeholder="Apt, Suite, Floor (optional)" id="ship-addr2" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <Input label="City *" placeholder="Dallas" id="ship-city" />
                    <Input label="State *" placeholder="TX" id="ship-state" />
                    <Input label="ZIP Code *" placeholder="75201" id="ship-zip" />
                  </div>
                  <SelectInput label="Country *" id="ship-country" options={['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'India', 'Other']} />

                  {/* Shipping Method */}
                  <div style={{ marginTop: '1.5rem' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600, marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Shipping Method</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <ShippingOption 
                        id="standard" selected={shippingMethod === 'standard'} 
                        onSelect={() => setShippingMethod('standard')}
                        label="Standard Shipping" desc="5–7 business days" price="$4.99"
                      />
                      <ShippingOption 
                        id="express" selected={shippingMethod === 'express'} 
                        onSelect={() => setShippingMethod('express')}
                        label="Express Shipping" desc="2–3 business days" price="$12.99"
                      />
                      <ShippingOption 
                        id="overnight" selected={shippingMethod === 'overnight'} 
                        onSelect={() => setShippingMethod('overnight')}
                        label="Overnight Delivery" desc="Next business day" price="$24.99"
                      />
                    </div>
                  </div>

                  <Button size="lg" style={{ marginTop: '2rem' }} onClick={(e) => { e.preventDefault(); setStep(2); }}>
                    Continue to Billing →
                  </Button>
                </form>
              </div>
              <OrderSummary cart={cart} subtotal={cartTotal} shipping={shipping} tax={tax} grandTotal={grandTotal} />
            </div>
          )}

          {/* STEP 2: Billing Address */}
          {step === 2 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '4rem', alignItems: 'start' }}>
              <div style={{ background: 'var(--surface)', padding: '3.5rem', borderRadius: '32px', border: '1px solid var(--border)' }}>
                <SectionTitle icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                } title="Billing Address" />

                {/* Same as Shipping Toggle */}
                <div 
                  onClick={() => setSameAsShipping(!sameAsShipping)}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '1.2rem', padding: '1.5rem 2rem',
                    background: sameAsShipping ? 'rgba(255, 77, 109, 0.08)' : 'rgba(255,255,255,0.03)',
                    border: `2px solid ${sameAsShipping ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: '16px', cursor: 'pointer', marginBottom: '2.5rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ 
                    width: '22px', height: '22px', borderRadius: '6px', 
                    background: sameAsShipping ? 'var(--primary)' : 'transparent', 
                    border: sameAsShipping ? 'none' : '2px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {sameAsShipping && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, marginBottom: '0.2rem' }}>Same as shipping address</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Use the address entered above for billing</p>
                  </div>
                </div>

                {!sameAsShipping && (
                  <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <Input label="First Name *" placeholder="John" id="bill-first" />
                      <Input label="Last Name *" placeholder="Rivers" id="bill-last" />
                    </div>
                    <Input label="Company Name" placeholder="Your Company (optional)" id="bill-company" />
                    <Input label="Address Line 1 *" placeholder="123 Business Blvd" id="bill-addr1" />
                    <Input label="Address Line 2" placeholder="Suite 400 (optional)" id="bill-addr2" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                      <Input label="City *" placeholder="Dallas" id="bill-city" />
                      <Input label="State *" placeholder="TX" id="bill-state" />
                      <Input label="ZIP Code *" placeholder="75201" id="bill-zip" />
                    </div>
                    <SelectInput label="Country *" id="bill-country" options={['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'India', 'Other']} />
                    <Input label="VAT / Tax ID" placeholder="Optional for business orders" id="bill-vat" />
                  </form>
                )}

                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                  <Button variant="outline" onClick={() => setStep(1)} style={{ flex: 1 }}>← Back</Button>
                  <Button onClick={() => setStep(3)} style={{ flex: 2 }}>Continue to Payment →</Button>
                </div>
              </div>
              <OrderSummary cart={cart} subtotal={cartTotal} shipping={shipping} tax={tax} grandTotal={grandTotal} />
            </div>
          )}

          {/* STEP 3: Payment */}
          {step === 3 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '4rem', alignItems: 'start' }}>
              <div style={{ background: 'var(--surface)', padding: '3.5rem', borderRadius: '32px', border: '1px solid var(--border-medium)' }}>
                <SectionTitle icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                } title="Payment Details" />

                {/* Payment Method Selector */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2.5rem' }}>
                  <PaymentMethodCard icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                  } label="Credit Card" selected={true} />
                  <PaymentMethodCard icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  } label="PayPal" selected={false} />
                  <PaymentMethodCard icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                  } label="Apple Pay" selected={false} />
                </div>

                <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <Input label="Cardholder Name *" placeholder="John Rivers" id="pay-name" />
                  <div style={{ position: 'relative' }}>
                    <Input label="Card Number *" placeholder="1234  5678  9012  3456" id="pay-card" />
                    <div style={{ position: 'absolute', right: '1rem', top: '2.8rem', display: 'flex', gap: '0.5rem', opacity: 0.6 }}>
                      <div style={{ width: '32px', height: '20px', background: '#1a1aff', borderRadius: '4px' }}></div>
                      <div style={{ width: '32px', height: '20px', background: '#ff4d4d', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                    <Input label="Expiry Date *" placeholder="MM / YY" id="pay-expiry" />
                    <Input label="CVV *" placeholder="•••" id="pay-cvv" />
                  </div>

                  {/* Security Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem 1.5rem', background: 'rgba(0, 245, 212, 0.05)', border: '1px solid rgba(0, 245, 212, 0.2)', borderRadius: '12px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00f5d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Your payment is protected with <strong>256-bit SSL encryption</strong>. We never store card details.</p>
                  </div>

                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                    <Button variant="outline" onClick={(e) => { e.preventDefault(); setStep(2); }} style={{ flex: 1 }}>← Back</Button>
                    <Button size="lg" style={{ flex: 2 }} onClick={(e) => { e.preventDefault(); setStep(4); clearCart(); }}>
                      Place Order — ${grandTotal.toFixed(2)}
                    </Button>
                  </div>
                </form>
              </div>
              <OrderSummary cart={cart} subtotal={cartTotal} shipping={shipping} tax={tax} grandTotal={grandTotal} />
            </div>
          )}

          {/* STEP 4: Success */}
          {step === 4 && (
            <div style={{ textAlign: 'center', padding: '8rem 0' }}>
               <div style={{ 
                  width: '120px', height: '120px', background: 'rgba(0, 245, 212, 0.1)', color: 'var(--success)', 
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  margin: '0 auto 3rem', border: '2px solid var(--success)'
               }}>
                 <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
               </div>
               <h1 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '1.5rem', color: 'var(--text-main)' }}>Story Secured. ✦</h1>
               <p style={{ fontSize: '1.4rem', color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto 1.5rem' }}>Thank you for supporting independent authors. A confirmation email has been sent to your inbox.</p>
               <p style={{ fontSize: '1rem', color: 'var(--text-dim)', marginBottom: '4rem' }}>Order #KDP-{Math.floor(Math.random() * 900000) + 100000} · Estimated delivery: 5–7 business days</p>
               <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
                 <Link href="/bookstore"><Button size="lg">Continue Shopping</Button></Link>
                 <Link href="/"><Button variant="outline" size="lg">Back to Home</Button></Link>
               </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}

// ——— Sub-components ———

function ProgressStep({ number, label, active, done }: { number: number, label: string, active: boolean, done: boolean }) {
   return (
      <div style={{ textAlign: 'center', opacity: active ? 1 : 0.3 }}>
         <div style={{ 
            width: '50px', height: '50px', borderRadius: '50%', 
            background: done ? 'var(--primary-color)' : active ? 'var(--primary-color)' : 'var(--surface-elevated)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontWeight: 800, margin: '0 auto 0.8rem', border: '1px solid var(--border-medium)',
            color: active || done ? '#fff' : 'var(--text-dim)',
            transition: 'all 0.4s ease'
         }}>
            {done ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> : number}
         </div>
         <p style={{ fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap' }}>{label}</p>
      </div>
   );
}

function ProgressLine({ active }: { active: boolean }) {
   return <div style={{ width: '80px', height: '2px', background: active ? 'var(--primary-color)' : 'var(--border-medium)', transition: 'background 0.4s ease', marginBottom: '2rem', flexShrink: 0 }}></div>;
}

function SectionTitle({ icon, title }: { icon: React.ReactNode, title: string }) {
   return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '2.5rem' }}>
         <div style={{ color: 'var(--primary-color)' }}>{icon}</div>
         <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>{title}</h2>
      </div>
   );
}

function Input({ label, placeholder, id, type = 'text' }: { label: string, placeholder: string, id: string, type?: string }) {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
         <label htmlFor={id} style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>
         <input 
            id={id} type={type} placeholder={placeholder} 
            style={{ 
               background: 'var(--surface-light)', border: '1px solid var(--border-medium)', 
               padding: '1rem 1.2rem', borderRadius: '12px', color: 'var(--text-main)', 
               outline: 'none', fontSize: '1rem', transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-medium)'}
         />
      </div>
   );
}

function SelectInput({ label, id, options }: { label: string, id: string, options: string[] }) {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
         <label htmlFor={id} style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>
         <select 
            id={id}
            style={{ 
               background: 'var(--surface-light)', border: '1px solid var(--border-medium)', 
               padding: '1rem 1.2rem', borderRadius: '12px', color: 'var(--text-main)', 
               outline: 'none', fontSize: '1rem', cursor: 'pointer', appearance: 'none'
            }}
         >
            {options.map(o => <option key={o} value={o}>{o}</option>)}
         </select>
      </div>
   );
}

function ShippingOption({ id, selected, onSelect, label, desc, price }: any) {
   return (
      <div 
         onClick={onSelect}
         style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1.2rem 1.5rem', borderRadius: '16px', cursor: 'pointer',
            background: selected ? 'var(--primary-surface)' : 'var(--surface)',
            border: `2px solid ${selected ? 'var(--primary-color)' : 'var(--border-medium)'}`,
            transition: 'all 0.3s ease'
         }}
      >
         <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <div style={{ 
               width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
               border: `2px solid ${selected ? 'var(--primary-color)' : 'var(--border-medium)'}`,
               background: selected ? 'var(--primary-color)' : 'transparent',
               display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
               {selected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--surface)' }}></div>}
            </div>
            <div>
               <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>{label}</p>
               <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{desc}</p>
            </div>
         </div>
         <span style={{ fontWeight: 800, color: selected ? 'var(--primary-color)' : 'var(--text-main)' }}>{price}</span>
      </div>
   );
}

function PaymentMethodCard({ icon, label, selected }: { icon: React.ReactNode, label: string, selected: boolean }) {
   return (
      <div style={{ 
         padding: '1.2rem', borderRadius: '16px', textAlign: 'center', cursor: 'pointer',
         background: selected ? 'var(--primary-surface)' : 'var(--surface)',
         border: `2px solid ${selected ? 'var(--primary-color)' : 'var(--border-medium)'}`,
         transition: 'all 0.3s ease'
      }}>
         <div style={{ color: selected ? 'var(--primary-color)' : 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>{icon}</div>
         <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>{label}</p>
      </div>
   );
}

function OrderSummary({ cart, subtotal, shipping, tax, grandTotal }: { cart: any[], subtotal: number, shipping: number, tax: number, grandTotal: number }) {
   return (
      <div style={{ background: 'var(--surface-light)', padding: '2.5rem', borderRadius: '32px', border: '1px solid var(--border-medium)', alignSelf: 'flex-start', position: 'sticky', top: '10rem' }}>
         <h3 style={{ marginBottom: '2rem', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>Order Summary</h3>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-medium)' }}>
            {cart.map(item => (
               <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ color: 'var(--text-muted)', flex: 1, lineHeight: '1.4' }}>{item.title} <span style={{ color: 'var(--text-dim)' }}>×{item.quantity}</span></span>
                  <span style={{ fontWeight: 700, whiteSpace: 'nowrap', color: 'var(--text-main)' }}>${(item.price * item.quantity).toFixed(2)}</span>
               </div>
            ))}
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
               <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
               <span>Shipping</span><span>${shipping.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
               <span>Tax (8%)</span><span>${tax.toFixed(2)}</span>
            </div>
         </div>
         <div style={{ borderTop: '1px solid var(--border-medium)', paddingTop: '1.8rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)' }}>
            <span>Total</span>
            <span style={{ color: 'var(--primary-color)' }}>${grandTotal.toFixed(2)}</span>
         </div>
         {/* Trust Badges */}
         <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {['Free returns within 30 days', 'Secure SSL encryption', 'Instant eBook delivery'].map(badge => (
               <div key={badge} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {badge}
               </div>
            ))}
         </div>
      </div>
   );
}
