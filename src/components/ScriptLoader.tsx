'use client';

import { useEffect } from 'react';

export default function ScriptLoader() {
  useEffect(() => {
    // Check if jQuery is already loaded
    if (typeof window !== 'undefined' && !(window as any).jQuery) {
      // Load jQuery
      const jqueryScript = document.createElement('script');
      jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
      jqueryScript.async = true;
      
      jqueryScript.onload = () => {
        // jQuery loaded, now load custom script
        const customScript = document.createElement('script');
        customScript.src = '/assets/js/custom.new.js';
        customScript.async = true;
        document.body.appendChild(customScript);
      };
      
      document.head.appendChild(jqueryScript);
    } else if (typeof window !== 'undefined' && (window as any).jQuery) {
      // jQuery already exists, just load custom script
      const customScript = document.createElement('script');
      customScript.src = '/assets/js/custom.new.js';
      customScript.async = true;
      document.body.appendChild(customScript);
    }
  }, []);

  return null;
}
