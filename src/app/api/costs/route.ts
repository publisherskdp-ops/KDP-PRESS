import { NextRequest, NextResponse } from 'next/server';
import { lulu } from '@/lib/lulu';

export const POST = async (request: NextRequest) => {
  try {
    const { luluJobId } = await request.json();

    if (!luluJobId) {
      return NextResponse.json(
        { error: 'luluJobId is required' },
        { status: 400 }
      );
    }

    // Call Lulu API to get costs
    const costData = await lulu.getPrintJobCosts(parseInt(luluJobId));

    return NextResponse.json({
      productCost: costData.product_cost || 0,
      shippingCost: costData.shipping_cost || 0,
      totalCost: (costData.product_cost || 0) + (costData.shipping_cost || 0),
    });

  } catch (error: any) {
    console.error('Lulu costs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch costs' },
      { status: 500 }
    );
  }
};
