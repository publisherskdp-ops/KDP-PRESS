import { getPublishingServiceHtml } from '../../../kdppress-nextjs-main/kdppress-nextjs-main/lib/htmlContent';
import PublishingPageClient from './PublishingPageClient';

export default function BookPublishingPage() {
  const { html } = getPublishingServiceHtml();
  return (
    <>
      <main className="min-h-screen bg-white">
        <PublishingPageClient html={html} />
      </main>
    </>
  );
}
