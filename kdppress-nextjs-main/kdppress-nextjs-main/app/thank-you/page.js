import { getThankYouHtml } from '../../lib/htmlContent';
import ThankYouPageClient from '../components/ThankYouPageClient';

export default function ThankYou() {
  const { html } = getThankYouHtml();
  return <ThankYouPageClient html={html} />;
}
