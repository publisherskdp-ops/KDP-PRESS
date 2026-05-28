
'use server';

import { lulu } from '@/lib/lulu';
import dbConnect from '@/lib/mongodb';
import Book from '@/models/Book';
import Order from '@/models/Order';
import { headers } from 'next/headers';

/**
 * Extracts and formats error details from Lulu API response
 */
function formatLuluError(errorDetails: any): string {
  if (!errorDetails || typeof errorDetails !== 'object') {
    return 'An unexpected error occurred with the print partner.';
  }

  const messages: string[] = [];

  // Check for line_items errors (invalid POD package IDs, etc.)
  if (errorDetails.line_items && Array.isArray(errorDetails.line_items)) {
    const podErrors = new Set<string>();
    
    errorDetails.line_items.forEach((item: any, index: number) => {
      // Navigate the nested structure to find the error messages
      const normalization = item?.printable_normalization?.printable_normalization;
      if (normalization?.detail && Array.isArray(normalization.detail)) {
        normalization.detail.forEach((detail: any) => {
          if (detail.msg) {
            // Extract the POD package ID from the error message if present
            const match = detail.msg.match(/Invalid pod_package_id: ([^\s,]+)/);
            if (match) {
              podErrors.add(`Invalid POD Package ID: ${match[1]}`);
            } else {
              podErrors.add(detail.msg);
            }
          }
        });
      }
    });

    if (podErrors.size > 0) {
      messages.push('Print configuration issue:');
      podErrors.forEach(msg => messages.push(`• ${msg}`));
    }
  }

  // Check for other error fields
  if (errorDetails.detail) {
    if (Array.isArray(errorDetails.detail)) {
      errorDetails.detail.forEach((err: any) => {
        if (err.msg) messages.push(err.msg);
      });
    } else if (typeof errorDetails.detail === 'string') {
      messages.push(errorDetails.detail);
    }
  }

  if (messages.length === 0) {
    messages.push('An error occurred while processing your order with the print partner. Please try again or contact support.');
  }

  return messages.join('\n');
}


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
      const digitalOrderId = `ORD-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
      return { success: true, job: { id: `DIGITAL-${Date.now()}`, external_id: `KDP-${digitalOrderId}` } };
    }
  
    const lineItems = await Promise.all(itemsForPrint.map(async (item, index) => {
      console.log(`Processing print item ${index + 1}/${itemsForPrint.length}:`, item.title, '| format:', item.format);
      
      // Strip any format suffix (e.g., -paperback, -hardcover, -ebook, -kindle) to get the base slug
      const baseSlug = item.id.replace(/-(paperback|hardcover|ebook|kindle)$/, '');
      console.log(`Resolved base slug for lookup: "${baseSlug}" (from item.id: "${item.id}")`);

      const bookData = await Book.findOne({ slug: baseSlug });
      
      if (!bookData) {
        throw new Error(`Could not find Book in DB for slug: "${baseSlug}"`);
      }

      let podPackageId = '';
      if (item.format === 'hardcover') {
        podPackageId = bookData.luluHardcoverId || '';
        console.log(`Selected Hardcover ID for ${bookData.title}: ${podPackageId}`);
      } else if (item.format === 'paperback') {
        podPackageId = bookData.luluPaperbackId || '';
        console.log(`Selected Paperback ID for ${bookData.title}: ${podPackageId}`);
      }

      if (!podPackageId) {
        throw new Error(`Lulu POD Package ID is missing/not generated for book "${bookData.title}" format "${item.format}"`);
      }

      const coverUrl = bookData.coverPdf 
        ? (bookData.coverPdf.startsWith('http') ? bookData.coverPdf : `${baseUrl}${bookData.coverPdf}`)
        : '';
      const manuscriptUrl = bookData.manuscriptUrl
        ? (bookData.manuscriptUrl.startsWith('http') ? bookData.manuscriptUrl : `${baseUrl}${bookData.manuscriptUrl}`)
        : '';

      if (!coverUrl) {
        throw new Error(`Print-ready Cover PDF is missing for book "${bookData.title}"`);
      }
      if (!manuscriptUrl) {
        throw new Error(`Print-ready Manuscript PDF is missing for book "${bookData.title}"`);
      }

      return {
        title: bookData.title,
        quantity: item.quantity,
        external_id: `item-${baseSlug || index}-${crypto.randomUUID()}`,
        printable_normalization: {
          cover: {
            source_url: coverUrl
          },
          interior: {
            source_url: manuscriptUrl
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

    // Save order to MongoDB
    const shipping = 5.99;
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = totalAmount * 0.08;
    const grossAmount = totalAmount + tax + shipping;
    
    console.log(`Calculated amounts - Total: ${totalAmount.toFixed(2)}, Tax: ${tax.toFixed(2)}, Shipping: ${shipping.toFixed(2)}, Gross: ${grossAmount.toFixed(2)}`);
    
    // Fetch book MongoDB IDs for cart items
    const booksWithIds = await Promise.all(cart.map(async (item) => {
      const baseSlug = item.id.replace(/-(paperback|hardcover|ebook|kindle)$/, '');
      const bookData = await Book.findOne({ slug: baseSlug });
      return {
        bookId: bookData?._id?.toString() || item.id,
        id: item.id,
        title: item.title,
        format: item.format || 'unknown',
        quantity: item.quantity,
        price: item.price
      };
    }));

    const order = await Order.create({
      luluJobId: result.id,
      externalId: jobData.external_id,
      books: booksWithIds,
      totalAmount,
      shippingAmount: shipping,
      shippingCharged: true,
      grossAmount,
      grossAmountCharged: true,
      status: 'PENDING'
    });
    console.log('Order created in MongoDB with ID:', order._id);

    console.log('Order saved to MongoDB:', order._id);

    return { success: true, job: result };
  } catch (error: any) {
    console.error('--- Order creation failed ---');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    if (error.response) {
       console.error('Error Response Data:', JSON.stringify(error.response.data, null, 2));
    }
    console.error('Stack:', error.stack);
    
    // Extract and format Lulu-specific error details
    let errorMessage = error.message;
    if (error.luluErrorDetails) {
      errorMessage = formatLuluError(error.luluErrorDetails);
    }
    
    return { success: false, error: errorMessage };
  }
}
