'use server';

import { lulu } from '@/lib/lulu';

export async function getLuluOrdersAction(page = 1) {
  try {
    const data = await lulu.listPrintJobs(page);
    return { success: true, orders: data.results, count: data.count };
  } catch (error: any) {
    console.error('Failed to fetch Lulu orders:', error);
    return { success: false, error: error.message };
  }
}
export async function getLuluCostsAction(luluJobId: number) {
  try {
    const costData = await lulu.getPrintJobCosts(luluJobId);

    return {
      success: true,
      cost: costData?.results || 0,
    };

  } catch (error: any) {
    console.error('Failed to fetch Lulu costs:', error);
    // Return actual Lulu API message
    return {
      success: false,
      cost: null,
      error:
        error?.luluErrorDetails?.detail ||
        error?.message ||
        'Unknown error',
    };
  }
}
