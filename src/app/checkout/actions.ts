
'use server';

import { lulu } from '@/lib/lulu';

export async function calculateShippingAction(shippingAddress: any, cart: any[]) {
  try {
    // Map cart items to Lulu line items
    // In a real app, you would fetch the luluPodPackageId from the DB
    // For now, we'll use a placeholder if not present
    const lineItems = cart.map(item => ({
      title: item.title,
      quantity: item.quantity,
      print_asset_id: item.luluPrintAssetId || "placeholder-asset",
      pod_package_id: item.luluPodPackageId || "0600X0900BWSTDPB060UW444MXX" 
    }));

    const result = await lulu.calculateShipping(shippingAddress, lineItems);
    return { success: true, rates: result.shipping_options };
  } catch (error: any) {
    console.error('Shipping calculation failed:', error);
    return { success: false, error: error.message };
  }
}

export async function createOrderAction(shippingAddress: any, cart: any[]) {
  try {
    // Map cart items to Lulu line items
    const lineItems = cart.map(item => ({
      title: item.title,
      quantity: item.quantity,
      print_asset_id: item.luluPrintAssetId || "placeholder-asset",
      pod_package_id: item.luluPodPackageId || "0600X0900BWSTDPB060UW444MXX" 
    }));

    const jobData = {
      contact_email: shippingAddress.email,
      external_id: `KDP-${Date.now()}`,
      shipping_level: shippingAddress.shipping_level || "MAIL",
      shipping_address: {
        name: `${shippingAddress.first_name} ${shippingAddress.last_name}`,
        street1: shippingAddress.street1,
        city: shippingAddress.city,
        state_code: shippingAddress.state_code,
        country_code: shippingAddress.country_code,
        postcode: shippingAddress.postcode
      },
      line_items: lineItems
    };

    const result = await lulu.createPrintJob(jobData);
    
    // In a real app, you would also save this to Prisma here
    // const transaction = await prisma.transaction.create({ ... })

    return { success: true, job: result };
  } catch (error: any) {
    console.error('Order creation failed:', error);
    return { success: false, error: error.message };
  }
}
