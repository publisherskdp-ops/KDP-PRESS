import React from 'react';
import { getThankYouHtml } from '../../../kdppress-nextjs-main/kdppress-nextjs-main/lib/htmlContent';
import ThankYouPageClient from './ThankYouPageClient';

export default function ThankYouPage() {
  const { html } = getThankYouHtml();
  return (
    <main className="min-h-screen bg-white">
      <ThankYouPageClient html={html} />
    </main>
  );
}
