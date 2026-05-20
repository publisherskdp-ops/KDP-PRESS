
'use server';

import { lulu } from '@/lib/lulu';
import dbConnect from '@/lib/mongodb';
import Book from '@/models/Book';
import { headers } from 'next/headers';




export async function createOrderAction(shippingAddress: any, cart: any[]) {
  try {
    await dbConnect();
    const host = (await headers()).get('host');
    const protocol = (await headers()).get('x-forwarded-proto') || 'http';
    const baseUrl = `${protocol}://${host}`;

    console.log('--- createOrderAction INIT ---');
    console.log('Received Cart:', JSON.stringify(cart, null, 2));

    const itemsForPrint = cart.filter(item => item.format !== 'kindle' && item.format !== 'ebook');
    console.log('Filtered itemsForPrint:', JSON.stringify(itemsForPrint, null, 2));

    if (itemsForPrint.length === 0) {
      console.log('Only digital items found. Returning digital order success.');
      return { success: true, job: { id: `DIGITAL-${Date.now()}`, external_id: `KDP-${Date.now()}` } };
    }
    
    // Map cart items to Lulu line items according to the new format
    const lineItems = await Promise.all(itemsForPrint.map(async (item, index) => {
      console.log(`Processing print item ${index + 1}/${itemsForPrint.length}:`, item.title, '| format:', item.format);
      const bookData = await Book.findOne({ slug: item.id });
      
      if (!bookData) {
        console.warn(`WARNING: Could not find Book in DB for slug: ${item.id}`);
      }

      let podPackageId = bookData?.luluPaperbackId ;
      if (item.format === 'hardcover' && bookData?.luluHardcoverId) {
        podPackageId = bookData.luluHardcoverId;
        console.log(`Selected Hardcover ID for ${item.title}: ${podPackageId}`);
      } else if (item.format === 'paperback' && bookData?.luluPaperbackId) {
        podPackageId = bookData.luluPaperbackId;
        console.log(`Selected Paperback ID for ${item.title}: ${podPackageId}`);
      } else {
        console.log(`Fallback ID or No matching format ID for ${item.title}: ${podPackageId}`);
      }

      return {
        title: bookData?.title || item.title,
        quantity: item.quantity,
        external_id: `item-${item.id || index}-${crypto.randomUUID()}`,
        printable_normalization: {
          cover: {
            source_url: bookData?.coverPdf ? `${baseUrl}${bookData.coverPdf}` : `${baseUrl}${bookData.coverPdf}`
          },
          interior: {
            source_url: bookData?.manuscriptUrl ? `${baseUrl}${bookData.manuscriptUrl}` : `${baseUrl}${bookData.manuscriptUrl}`
          },
          pod_package_id: podPackageId
        }
      };
    }));



    const jobData = {
      contact_email: shippingAddress.email,
      external_id: `order-${crypto.randomUUID()}`,
      production_delay: 120,
      shipping_level: 'MAIL',
      shipping_address: {
        city: shippingAddress.city,
        country_code: shippingAddress.country_code,
        name: `${shippingAddress.first_name} ${shippingAddress.last_name}`,
        phone_number: shippingAddress.phone || "000-000-0000",
        postcode: shippingAddress.postcode,
        state_code: shippingAddress.state_code || "",
        street1: shippingAddress.street1,
      },
      line_items: lineItems
    };

    console.log('--- Creating Lulu Print Job ---');
    console.log('Job Data Payload:', JSON.stringify(jobData, null, 2));

    const result = await lulu.createPrintJob(jobData);
    
    console.log('Lulu API Response:', JSON.stringify(result, null, 2));

    // In a real app, you would also save this to MongoDB here
    // const transaction = await prisma.transaction.create({ ... })

    return { success: true, job: result };
  } catch (error: any) {
    console.error('--- Order creation failed ---');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    if (error.response) {
       console.error('Error Response Data:', JSON.stringify(error.response.data, null, 2));
    }
    console.error('Stack:', error.stack);
    return { success: false, error: error.message };
  }
}
