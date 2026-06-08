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

  // 1.5 Check for messages inside line_items status (nested structure Lulu sometimes uses)
  if (order.line_items && Array.isArray(order.line_items)) {
    order.line_items.forEach((item: any, idx: number) => {
      const itemTitle = item.title || `Item ${idx + 1}`;
      if (item.status && item.status.messages && item.status.messages.printable_normalization) {
        const norm = item.status.messages.printable_normalization;
        if (norm.cover && Array.isArray(norm.cover)) {
          norm.cover.forEach((msg: string) => reasons.push(`[${itemTitle} - Cover] ${msg}`));
        }
        if (norm.interior && Array.isArray(norm.interior)) {
          norm.interior.forEach((msg: string) => reasons.push(`[${itemTitle} - Interior] ${msg}`));
        }
      }
    });
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
      
      // Look for stringified errors on the item level
      if (item.error && typeof item.error === 'string') {
        reasons.push(`[${itemTitle}] ${item.error}`);
      }
      
      // Parse printable_normalization
      const parsePrintableNorm = (norm: any) => {
        if (!norm) return;
        
        // If it's a string, try to parse it
        if (typeof norm === 'string') {
          // If it looks like the Lulu Python dict string e.g. "{'printable_normalization': {'cover': ['Book Size...']}}"
          if (norm.includes('printable_normalization') || norm.includes('cover') || norm.includes('interior')) {
            // Extract everything between brackets since the error messages are in arrays
            const regex = /\[(.*?)\]/g;
            let match;
            let found = false;
            while ((match = regex.exec(norm)) !== null) {
              found = true;
              // Clean up the string by removing the surrounding quotes
              let msg = match[1].trim();
              msg = msg.replace(/^['"]|['"]$/g, '');
              // Clean up escaped quotes
              msg = msg.replace(/\\"/g, '"').replace(/\\'/g, "'");
              
              // Identify if it's a cover or interior issue based on the context before the array
              const prefixContext = norm.substring(Math.max(0, match.index - 20), match.index);
              const typeLabel = prefixContext.includes('cover') ? 'Cover' : (prefixContext.includes('interior') ? 'Interior' : '');
              const label = typeLabel ? `[${itemTitle} - ${typeLabel}]` : `[${itemTitle}]`;
              
              reasons.push(`${label} ${msg}`);
            }
            if (found) return;
          }
          
          try {
            // Fallback JSON parsing
            const validJsonStr = norm.replace(/^"|"$/g, '').replace(/'/g, '"');
            const parsed = JSON.parse(validJsonStr);
            parsePrintableNorm(parsed);
            return;
          } catch (e) {
            reasons.push(`[${itemTitle}] ${norm}`);
            return;
          }
        }
        
        if (Array.isArray(norm.detail)) {
          norm.detail.forEach((d: any) => {
            if (d.msg) reasons.push(`[${itemTitle}] ${d.msg}`);
          });
        }
        
        if (norm.cover && Array.isArray(norm.cover)) {
          norm.cover.forEach((msg: string) => reasons.push(`[${itemTitle} - Cover] ${msg}`));
        }
        
        if (norm.interior && Array.isArray(norm.interior)) {
          norm.interior.forEach((msg: string) => reasons.push(`[${itemTitle} - Interior] ${msg}`));
        }

        if (norm.printable_normalization) {
           parsePrintableNorm(norm.printable_normalization);
        }
      };

      parsePrintableNorm(item.printable_normalization);
      parsePrintableNorm(item.error);
      
    });
  }

  // Filter out generic message if we have specific reasons
  if (reasons.length > 1) {
    const genericMsgs = ["One or more line-items were rejected.", "Bad Request"];
    const filtered = reasons.filter(r => !genericMsgs.includes(r));
    if (filtered.length > 0) return Array.from(new Set(filtered)); // Remove duplicates
  }

  return Array.from(new Set(reasons)); // Return unique reasons
};