// app/orders/_utils/statusHelpers.ts

export const getStatusName = (status: any): string => {
  if (!status) return 'UNKNOWN';
  return typeof status === 'string' ? status : (status.name || 'UNKNOWN');
};

export const getStatusColor = (status: any): string => {
  const s = getStatusName(status).toLowerCase();
  if (s.includes('shipped') || s.includes('complete')) return '#10b981'; // emerald-500
  if (s.includes('error') || s.includes('reject') || s.includes('canceled')) return '#ef4444'; // red-500
  if (s.includes('unpaid')) return '#f59e0b'; // amber-500
  if (s.includes('pending') || s.includes('created')) return '#3b82f6'; // blue-500
  return '#64748b'; // slate-500
};

export const getRejectionReasons = (order: any): string[] => {
  const reasons: string[] = [];
  if (!order) return reasons;
  
  // 1. Check status object fields
  if (order.status && typeof order.status === 'object') {
    if (order.status.message) {
      reasons.push(order.status.message);
    }
    if (Array.isArray(order.status.errors)) {
      order.status.errors.forEach((err: any) => {
        if (typeof err === 'string') {
          reasons.push(err);
        } else if (err && typeof err === 'object') {
          if (err.message) {
            reasons.push(err.message);
          } else if (err.msg) {
            reasons.push(err.msg);
          } else {
            reasons.push(JSON.stringify(err));
          }
        }
      });
    }
  }
  
  // 2. Check top-level error property
  if (order.error) {
    if (typeof order.error === 'string') {
      reasons.push(order.error);
    } else if (typeof order.error === 'object') {
      if (order.error.message) reasons.push(order.error.message);
      if (order.error.detail) reasons.push(JSON.stringify(order.error.detail));
    }
  }
  
  // 3. Check line items for errors/normalization messages
  if (order.line_items && Array.isArray(order.line_items)) {
    order.line_items.forEach((item: any, idx: number) => {
      const itemTitle = item.title || `Item ${idx + 1}`;
      const printableNorm = item.printable_normalization;
      if (printableNorm) {
        if (Array.isArray(printableNorm.detail)) {
          printableNorm.detail.forEach((d: any) => {
            if (d.msg) reasons.push(`[${itemTitle}] ${d.msg}`);
          });
        }
        const nestedNorm = printableNorm.printable_normalization;
        if (nestedNorm && Array.isArray(nestedNorm.detail)) {
          nestedNorm.detail.forEach((d: any) => {
            if (d.msg) reasons.push(`[${itemTitle}] ${d.msg}`);
          });
        }
      }
    });
  }
  
  return reasons;
};