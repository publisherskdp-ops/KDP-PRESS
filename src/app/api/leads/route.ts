import { NextRequest, NextResponse } from 'next/server';

function normalizeField(value: any): string {
  if (Array.isArray(value)) {
    return value[0] || '';
  }
  return value || '';
}

// function getRealIpAddress(request: NextRequest): string {
//   const headers = request.headers;

//   if (headers.get('x-real-ip')) {
//     return headers.get('x-real-ip') || 'UNKNOWN';
//   }

//   if (headers.get('x-forwarded-for')) {
//     const forwarded = headers.get('x-forwarded-for')?.split(',').map((ip) => ip.trim()) || [];
//     return forwarded.find((ip) => ip) || 'UNKNOWN';
//   }

//   return request.ip || 'UNKNOWN';
// }

function getRealIpAddress(request: NextRequest): string {
  const headers = request.headers;

  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    const ips = forwarded.split(',').map((ip) => ip.trim());
    return ips[0] || 'UNKNOWN';
  }

  return 'UNKNOWN'; // ❌ removed request.ip
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const fields: Record<string, any> = {};

    // Convert FormData to regular object
    for (const [key, value] of formData.entries()) {
      fields[key] = value;
    }

    console.log('Form submitted:', fields);

    // Normalize fields
    const firstName = normalizeField(fields.first_name);
    const lastName = normalizeField(fields.last_name);
    const email = normalizeField(fields.email);
    const phone = normalizeField(fields.phone);
    let brief = normalizeField(fields.brief);
    const route = normalizeField(fields.route);

    // Validation
    if (!firstName || !email || !phone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Spam filter
    if (phone === '5556660606' || phone === '555-666-0606') {
      return NextResponse.json(
        { success: true, message: 'Form submitted successfully' },
        { status: 200 }
      );
    }

    const clientIp = getRealIpAddress(request);

    // Build data object for webhook
    const data = {
      name: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      brief,
      domain: 'www.kdpPress.com',
      brand: 'www.kdpPress.com',
      ip_address: clientIp,
      route,
    };

    // Add manuscript URL if file was uploaded
    if (fields.manuscript_url) {
      data.manuscript_url = fields.manuscript_url;
      brief = `${brief} | Manuscript: ${fields.manuscript_url}`;
      data.brief = brief;
    }

    // Send to webhook
    try {
      console.log('Sending data to webhook:', JSON.stringify(data, null, 2));

      const webhookResponse = await fetch(
        'https://savtrack.savtechglobal.com/api/customer',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );

      // Try to parse response body
      let responseData;
      try {
        responseData = await webhookResponse.json();
      } catch (e) {
        responseData = await webhookResponse.text();
      }

      console.log('Webhook response status:', webhookResponse.status);
      console.log('Webhook response body:', responseData);

      // Check for success - handle both 200 and 201 responses
      if (!webhookResponse.ok) {
        console.error('Webhook request failed:', {
          status: webhookResponse.status,
          statusText: webhookResponse.statusText,
          body: responseData,
        });
        throw new Error(`Webhook error: ${webhookResponse.status} ${webhookResponse.statusText}`);
      }

      console.log('Successfully sent to webhook');
    } catch (webhookError) {
      console.error('Webhook error details:', webhookError);
      // Don't fail the entire form submission if webhook fails
      // Just log it and continue
      console.warn('Webhook submission failed, but form will still be marked successful');
    }

    // Return success response (even if webhook has issues)
    return NextResponse.json(
      { success: true, message: 'Form submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing form:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
