'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Button from '@/components/Button';
import { useCart } from '@/components/CartContext';
import Link from 'next/link';
import { calculateShippingAction, createOrderAction } from './actions';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { 
  validateEmail, 
  validatePhone, 
  validateCreditCard, 
  validateExpiryDate, 
  validateCVV, 
  validateRequired,
  validateZipCode
} from '@/lib/validation';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Billing, 3: Payment, 4: Success
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [shippingRates, setShippingRates] = useState<any[]>([]);
  // const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  
  // Shipping Address State
  const [address, setAddress] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    street1: '',
    city: '',
    state_code: '',
    postcode: '',
    country_code: 'US'
  });

  // Billing Address State
  const [billingAddress, setBillingAddress] = useState({
    first_name: '',
    last_name: '',
    street1: '',
    city: '',
    state_code: '',
    postcode: '',
    country_code: 'US'
  });

  // Payment Details State
  // const [payment, setPayment] = useState({
  //   cardholderName: '',
  //   cardNumber: '',
  //   expiryDate: '',
  //   cvv: ''
  // });

  // Validation States
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const validateStep1 = () => {
    const newErrors: Record<string, string | null> = {};
    if (!address.first_name) newErrors['ship-first'] = 'First name is required';
    if (!address.last_name) newErrors['ship-last'] = 'Last name is required';
    if (!address.email) {
      newErrors['ship-email'] = 'Email is required';
    } else if (validateEmail(address.email)) {
      newErrors['ship-email'] = validateEmail(address.email);
    }
    if (!address.phone) {
      newErrors['ship-phone'] = 'Phone number is required';
    } else if (validatePhone(address.phone)) {
      newErrors['ship-phone'] = validatePhone(address.phone);
    }
    if (!address.street1) newErrors['ship-addr1'] = 'Address is required';
    if (!address.city) newErrors['ship-city'] = 'City is required';
    if (!address.state_code) newErrors['ship-state'] = 'State is required';
    if (!address.postcode) {
      newErrors['ship-zip'] = 'ZIP code is required';
    } else if (validateZipCode(address.postcode)) {
      newErrors['ship-zip'] = validateZipCode(address.postcode);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    if (sameAsShipping) return true;
    const newErrors: Record<string, string | null> = {};
    if (!billingAddress.first_name) newErrors['bill-first'] = 'First name is required';
    if (!billingAddress.last_name) newErrors['bill-last'] = 'Last name is required';
    if (!billingAddress.street1) newErrors['bill-addr1'] = 'Address is required';
    if (!billingAddress.city) newErrors['bill-city'] = 'City is required';
    if (!billingAddress.state_code) newErrors['bill-state'] = 'State is required';
    if (!billingAddress.postcode) {
      newErrors['bill-zip'] = 'ZIP code is required';
    } else if (validateZipCode(billingAddress.postcode)) {
      newErrors['bill-zip'] = validateZipCode(billingAddress.postcode);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const validateStep3 = () => {
  //   const newErrors: Record<string, string | null> = {};
  //   if (!payment.cardholderName) newErrors['pay-name'] = 'Cardholder name is required';
  //   if (!payment.cardNumber) {
  //     newErrors['pay-card'] = 'Card number is required';
  //   } else if (validateCreditCard(payment.cardNumber)) {
  //     newErrors['pay-card'] = validateCreditCard(payment.cardNumber);
  //   }
  //   if (!payment.expiryDate) {
  //     newErrors['pay-expiry'] = 'Expiry date is required';
  //   } else if (validateExpiryDate(payment.expiryDate)) {
  //     newErrors['pay-expiry'] = validateExpiryDate(payment.expiryDate);
  //   }
  //   if (!payment.cvv) {
  //     newErrors['pay-cvv'] = 'CVV is required';
  //   } else if (validateCVV(payment.cvv)) {
  //     newErrors['pay-cvv'] = validateCVV(payment.cvv);
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  // const handleCalculateShipping = async () => {
  //   if (!address.street1 || !address.city || !address.postcode) {
  //     setErrors(prev => ({
  //       ...prev,
  //       'ship-addr1': !address.street1 ? 'Address is required' : null,
  //       'ship-city': !address.city ? 'City is required' : null,
  //       'ship-zip': !address.postcode ? 'ZIP code is required' : null,
  //     }));
  //     return;
  //   }
    
  //   setIsCalculatingShipping(true);
  //   const res = await calculateShippingAction(address, cart);
  //   if (res.success) {
  //     setShippingRates(res.rates);
  //     if (res.rates.length > 0) {
  //       setShippingMethod(res.rates[0].level);
  //     }
  //   }
  //   setIsCalculatingShipping(false);
  // };

  // const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    const res = await createOrderAction({
      ...address,
      shipping_level: shippingMethod
    }, cart);
    
    if (res.success) {
      setStep(4);
      clearCart();
    } else {
      alert(`Order failed: ${res.error}`);
    }
    setIsPlacingOrder(false);
  };

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

  const selectedRate = shippingRates.find(r => r.level === shippingMethod);
  const shipping = selectedRate ? parseFloat(selectedRate.total_price) : 0;
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
                    <Input 
                      label="First Name *" 
                      placeholder="John" 
                      id="ship-first" 
                      value={address.first_name} 
                      onChange={(val) => { setAddress({...address, first_name: val}); if (errors['ship-first']) setErrors({...errors, 'ship-first': null}); }} 
                      error={errors['ship-first']}
                    />
                    <Input 
                      label="Last Name *" 
                      placeholder="Rivers" 
                      id="ship-last" 
                      value={address.last_name} 
                      onChange={(val) => { setAddress({...address, last_name: val}); if (errors['ship-last']) setErrors({...errors, 'ship-last': null}); }} 
                      error={errors['ship-last']}
                    />
                  </div>
                  <Input 
                    label="Email Address *" 
                    placeholder="john@example.com" 
                    id="ship-email" 
                    type="email" 
                    value={address.email} 
                    onChange={(val) => { setAddress({...address, email: val}); if (errors['ship-email']) setErrors({...errors, 'ship-email': null}); }} 
                    error={errors['ship-email']}
                  />
                  <Input 
                    label="Phone Number" 
                    placeholder="+1 (555) 000-0000" 
                    id="ship-phone" 
                    type="tel" 
                    value={address.phone} 
                    onChange={(val) => { setAddress({...address, phone: val}); if (errors['ship-phone']) setErrors({...errors, 'ship-phone': null}); }} 
                    error={errors['ship-phone']}
                  />
                  <Input 
                    label="Address Line 1 *" 
                    placeholder="123 Publishing Way" 
                    id="ship-addr1" 
                    value={address.street1} 
                    onChange={(val) => { setAddress({...address, street1: val}); if (errors['ship-addr1']) setErrors({...errors, 'ship-addr1': null}); }} 
                    error={errors['ship-addr1']}
                  />
                  <Input label="Address Line 2" placeholder="Apt, Suite, Floor (optional)" id="ship-addr2" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <Input 
                      label="City *" 
                      placeholder="Dallas" 
                      id="ship-city" 
                      value={address.city} 
                      onChange={(val) => { setAddress({...address, city: val}); if (errors['ship-city']) setErrors({...errors, 'ship-city': null}); }} 
                      error={errors['ship-city']}
                    />
                    <Input 
                      label="State *" 
                      placeholder="TX" 
                      id="ship-state" 
                      value={address.state_code} 
                      onChange={(val) => { setAddress({...address, state_code: val}); if (errors['ship-state']) setErrors({...errors, 'ship-state': null}); }} 
                      error={errors['ship-state']}
                    />
                    <Input 
                      label="ZIP Code *" 
                      placeholder="75201" 
                      id="ship-zip" 
                      value={address.postcode} 
                      onChange={(val) => { setAddress({...address, postcode: val}); if (errors['ship-zip']) setErrors({...errors, 'ship-zip': null}); }} 
                      error={errors['ship-zip']}
                    />
                  </div>
                  <SelectInput label="Country *" id="ship-country" value={address.country_code} onChange={(val) => setAddress({...address, country_code: val})} options={['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'IN']} />

                  <Button 
                    size="lg" 
                    style={{ marginTop: '2rem' }} 
                    onClick={(e) => { e.preventDefault(); if (validateStep1()) setStep(2); }}
                  >
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
                      <Input 
                        label="First Name *" 
                        placeholder="John" 
                        id="bill-first" 
                        value={billingAddress.first_name}
                        onChange={(val) => { setBillingAddress({...billingAddress, first_name: val}); if (errors['bill-first']) setErrors({...errors, 'bill-first': null}); }}
                        error={errors['bill-first']}
                      />
                      <Input 
                        label="Last Name *" 
                        placeholder="Rivers" 
                        id="bill-last" 
                        value={billingAddress.last_name}
                        onChange={(val) => { setBillingAddress({...billingAddress, last_name: val}); if (errors['bill-last']) setErrors({...errors, 'bill-last': null}); }}
                        error={errors['bill-last']}
                      />
                    </div>
                    <Input label="Company Name" placeholder="Your Company (optional)" id="bill-company" />
                    <Input 
                      label="Address Line 1 *" 
                      placeholder="123 Business Blvd" 
                      id="bill-addr1" 
                      value={billingAddress.street1}
                      onChange={(val) => { setBillingAddress({...billingAddress, street1: val}); if (errors['bill-addr1']) setErrors({...errors, 'bill-addr1': null}); }}
                      error={errors['bill-addr1']}
                    />
                    <Input label="Address Line 2" placeholder="Suite 400 (optional)" id="bill-addr2" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                      <Input 
                        label="City *" 
                        placeholder="Dallas" 
                        id="bill-city" 
                        value={billingAddress.city}
                        onChange={(val) => { setBillingAddress({...billingAddress, city: val}); if (errors['bill-city']) setErrors({...errors, 'bill-city': null}); }}
                        error={errors['bill-city']}
                      />
                      <Input 
                        label="State *" 
                        placeholder="TX" 
                        id="bill-state" 
                        value={billingAddress.state_code}
                        onChange={(val) => { setBillingAddress({...billingAddress, state_code: val}); if (errors['bill-state']) setErrors({...errors, 'bill-state': null}); }}
                        error={errors['bill-state']}
                      />
                      <Input 
                        label="ZIP Code *" 
                        placeholder="75201" 
                        id="bill-zip" 
                        value={billingAddress.postcode}
                        onChange={(val) => { setBillingAddress({...billingAddress, postcode: val}); if (errors['bill-zip']) setErrors({...errors, 'bill-zip': null}); }}
                        error={errors['bill-zip']}
                      />
                    </div>
                    <SelectInput label="Country *" id="bill-country" value={billingAddress.country_code} onChange={(val) => setBillingAddress({...billingAddress, country_code: val})} options={['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'IN']} />
                    <Input label="VAT / Tax ID" placeholder="Optional for business orders" id="bill-vat" />
                  </form>
                )}

                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                  <Button variant="outline" onClick={() => setStep(1)} style={{ flex: 1 }}>← Back</Button>
                  <Button 
                    onClick={() => { if (validateStep2()) setStep(3); }} 
                    style={{ flex: 2 }}
                  >
                    Continue to Payment →
                  </Button>
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
                } title="Payment" />

                <div style={{ marginBottom: '2.5rem' }}>
                  <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    Please complete your payment via PayPal to finalize your order.
                  </p>
                  
                  <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                    <PayPalButtons 
                      style={{ layout: "vertical", shape: "rect", label: "pay" }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          intent: "CAPTURE",
                          purchase_units: [
                            {
                              amount: {
                                currency_code: "USD",
                                value: grandTotal.toFixed(2),
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={async (data, actions) => {
                        if (actions.order) {
                          const details = await actions.order.capture();
                          console.log("PayPal Transaction Success:", details);
                          handlePlaceOrder();
                        }
                      }}
                      onError={(err) => {
                        console.error("PayPal Error:", err);
                        alert("An error occurred with PayPal. Please try again.");
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem' }}>
                  <Button variant="outline" onClick={(e) => { e.preventDefault(); setStep(2); }} style={{ flex: 1 }}>← Back to Billing</Button>
                </div>
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

function Input({ label, placeholder, id, type = 'text', value, onChange, error, onBlur }: { 
  label: string, 
  placeholder: string, 
  id: string, 
  type?: string, 
  value?: string, 
  onChange?: (val: string) => void,
  error?: string | null,
  onBlur?: () => void
}) {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', position: 'relative' }}>
         <label htmlFor={id} style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>
         <input 
            id={id} type={type} placeholder={placeholder} 
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            onBlur={onBlur}
            style={{ 
               background: 'var(--surface-light)', border: `1px solid ${error ? '#ff4d4d' : 'var(--border-medium)'}`, 
               padding: '1rem 1.2rem', borderRadius: '12px', color: 'var(--text-main)', 
               outline: 'none', fontSize: '1rem', transition: 'all 0.2s ease',
               width: '100%'
            }}
            onFocus={(e) => {
              if (!error) e.target.style.borderColor = 'var(--primary-color)';
              e.target.style.boxShadow = error ? '0 0 0 2px rgba(255, 77, 77, 0.1)' : '0 0 0 2px rgba(255, 77, 109, 0.1)';
            }}
         />
         {error && (
           <p style={{ fontSize: '0.75rem', color: '#ff4d4d', marginTop: '0.2rem', fontWeight: 500 }}>{error}</p>
         )}
      </div>
   );
}

function SelectInput({ label, id, options, value, onChange }: { label: string, id: string, options: string[], value?: string, onChange?: (val: string) => void }) {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
         <label htmlFor={id} style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>
         <select 
            id={id}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
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
