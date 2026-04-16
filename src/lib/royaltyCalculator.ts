import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2026-03-25.dahlia',
});

interface CheckoutParams {
  bookId: string;
  price: number;
  authorStripeAccountId: string;
}

export const createCheckoutSession = async ({ bookId, price, authorStripeAccountId }: CheckoutParams) => {
  // 1. Calculate Royalties & Platform Fee
  // KDP Press logic constraint: (List Price * Rate) - Print cost/Fees. (Assuming digital only for now, $0 cost)
  const ROYALTY_RATE = 0.70;
  const platformFee = price * (1 - ROYALTY_RATE);
  
  // Convert dollars to cents for Stripe
  const application_fee_amount = Math.round(platformFee * 100);

  // 2. Mock Standard/Express account capability for checkout simulation
  // return simulated checkout structure
  return {
    success_url: `http://localhost:3000/bookstore/${bookId}?success=1`,
    cancel_url: `http://localhost:3000/bookstore/${bookId}?canceled=1`,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Book ID: ${bookId}`,
          },
          unit_amount: Math.round(price * 100),
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      application_fee_amount,
      transfer_data: {
        destination: authorStripeAccountId,
      },
    },
    mode: 'payment',
  };
};

export const runTaxVerification = async (userId: string) => {
  /**
   * multi-step "Tax Interview" using Stripe Tax or TaxBandits API to collect W-8/W-9 forms. 
   * Block "Live" publishing until verified.
   */
  console.log(`Verifying tax status for User ${userId}`);
  return { status: 'VERIFIED', message: 'W-9 Submitted and Approved via mock endpoints' };
}
