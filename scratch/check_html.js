import { getPublishingServiceHtml } from './kdppress-nextjs-main/kdppress-nextjs-main/lib/htmlContent.js';

const result = getPublishingServiceHtml();
console.log('--- HEAD STYLES ---');
console.log(result.html.split('\n')[0]);
console.log('--- BODY SNIPPET ---');
console.log(result.html.substring(0, 500));
console.log('--- TAIL SNIPPET ---');
console.log(result.html.substring(result.html.length - 1000));
