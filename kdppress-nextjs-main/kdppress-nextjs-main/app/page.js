import { getPublishingServiceHtml } from '../lib/htmlContent';
import PublishingPageClient from './components/PublishingPageClient';

export default function Home() {
  const { html } = getPublishingServiceHtml();
  return <PublishingPageClient html={html} />;
}
