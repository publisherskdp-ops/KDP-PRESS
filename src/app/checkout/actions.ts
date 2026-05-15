
'use server';

import { lulu } from '@/lib/lulu';

export async function calculateShippingAction(shippingAddress: any, cart: any[]) {
  try {
    // Map cart items to Lulu line items for calculation
    const lineItems = cart.map(item => ({
      title: item.title,
      quantity: item.quantity,
      pod_package_id: item.luluPodPackageId || "0600X0900.BW.STD.PB.060UW444.MXX" 
    }));

    const result = await lulu.calculateShipping({
      name: `${shippingAddress.first_name} ${shippingAddress.last_name}`,
      street1: shippingAddress.street1,
      city: shippingAddress.city,
      state_code: shippingAddress.state_code || "",
      country_code: shippingAddress.country_code,
      postcode: shippingAddress.postcode,
      phone_number: shippingAddress.phone || "000-000-0000"
    }, lineItems);
    
    return { success: true, rates: result.shipping_options };
  } catch (error: any) {
    console.error('Shipping calculation failed:', error);
    return { success: false, error: error.message };
  }
}

export async function createOrderAction(shippingAddress: any, cart: any[], paymentDetails?: any) {
  try {
    // Map cart items to Lulu line items according to the new format
    const lineItems = cart.map((item, index) => ({
      title: item.title,
      quantity: item.quantity,
      external_id: `item-${item.id || index}-${Date.now()}`,
      printable_normalization: {
        cover: {
          source_url: item.coverUrl || "https://www.dropbox.com/s/7bv6mg2tj0h3l0r/lulu_trade_perfect_template.pdf?dl=1&raw=1"
        },
        interior: {
          source_url: item.manuscriptUrl || "https://www.dropbox.com/s/r20orb8umqjzav9/lulu_trade_interior_template-32.pdf?dl=1&raw=1"
        },
        pod_package_id: item.luluPodPackageId || "0600X0900.BW.STD.PB.060UW444.MXX" 
      }
    }));

    const jobData = {
      contact_email: shippingAddress.email,
      external_id: paymentDetails?.id ? `PAYPAL-${paymentDetails.id}` : `KDP-${Date.now()}`,
      production_delay: 120, // Added production delay
      shipping_level: shippingAddress.shipping_level || "MAIL",
      shipping_address: {
        name: `${shippingAddress.first_name} ${shippingAddress.last_name}`,
        street1: shippingAddress.street1,
        city: shippingAddress.city,
        state_code: shippingAddress.state_code || "",
        country_code: shippingAddress.country_code,
        postcode: shippingAddress.postcode,
        phone_number: shippingAddress.phone || "000-000-0000" // Added phone number
      },
      line_items: lineItems
    };

    const result = await lulu.createPrintJob(jobData);
    // In a real app, you would also save this to MongoDB here
    // const transaction = await prisma.transaction.create({ ... })

    return { success: true, job: result };
  } catch (error: any) {
    console.error('Order creation failed:', error);
    return { success: false, error: error.message };
  }
}
