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
