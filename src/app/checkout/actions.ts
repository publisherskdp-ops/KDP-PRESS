
'use server';

import { lulu } from '@/lib/lulu';
import dbConnect from '@/lib/mongodb';
import Book from '@/models/Book';
import { headers } from 'next/headers';


export async function calculateShippingAction(shippingAddress: any, cart: any[]) {
  try {
    await dbConnect();
    // Map cart items to Lulu line items for calculation
    const lineItems = await Promise.all(cart.map(async (item) => {
      const bookData = await Book.findOne({ slug: item.id });
      return {
        title: bookData?.title || item.title,
        quantity: item.quantity,
        pod_package_id: bookData?.luluPaperbackId || "0600X0900.BW.STD.PB.060UW444.MXX" 
      };
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
    await dbConnect();
    const host = (await headers()).get('host');
    const protocol = (await headers()).get('x-forwarded-proto') || 'http';
    const baseUrl = `${protocol}://${host}`;

    // Map cart items to Lulu line items according to the new format
    const lineItems = await Promise.all(cart.map(async (item, index) => {
      const bookData = await Book.findOne({ slug: item.id });
      
      return {
        title: bookData?.title || item.title,
        quantity: item.quantity,
        external_id: `item-${item.id || index}-${Date.now()}`,
        printable_normalization: {
          cover: {
            source_url: bookData?.coverPdf ? `${baseUrl}${bookData.coverPdf}` : "https://www.dropbox.com/s/7bv6mg2tj0h3l0r/lulu_trade_perfect_template.pdf?dl=1&raw=1"
          },
          interior: {
            source_url: bookData?.manuscriptUrl ? `${baseUrl}${bookData.manuscriptUrl}` : "https://www.dropbox.com/s/r20orb8umqjzav9/lulu_trade_interior_template-32.pdf?dl=1&raw=1"
          },
          pod_package_id: bookData?.luluPaperbackId || "0600X0900.BW.STD.PB.060UW444.MXX" 
        }
      };
    }));


    const luluShippingLevel = shippingAddress.shipping_level === 'standard' ? 'MAIL' : (shippingAddress.shipping_level || "MAIL");

    const jobData = {
      contact_email: shippingAddress.email,
      external_id: paymentDetails?.id ? `PAYPAL-${paymentDetails.id}` : `KDP-${Date.now()}`,
      production_delay: 120, // Added production delay
      shipping_level: 'MAIL',
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
