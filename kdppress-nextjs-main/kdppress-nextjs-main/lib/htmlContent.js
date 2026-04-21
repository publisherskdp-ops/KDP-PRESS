import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const subprojectRoot = path.join(__dirname, '..');

const viewsDir = path.join(subprojectRoot, 'views');

function normalizeAssetPaths(html) {
  return html
    .replace(/src=["']\.\.\/assets\//g, 'src="/assets/')
    .replace(/href=["']\.\.\/assets\//g, 'href="/assets/')
    .replace(/src=["']assets\//g, 'src="/assets/')
    .replace(/href=["']assets\//g, 'href="/assets/')
    .replace(/href=["']images\/logo\/favicon\.png["']/g, 'href="/assets/images/logo.png"')
    .replace(/href=["']\/css\/fonts\/3841E4_0_0\.woff2["']/g, 'href="/assets/fonts/3841E4_0_0.woff2"')
    .replace(/<link rel="icon"[^>]*>/gi, '');
}

function removePhp(html) {
  return html.replace(/<\?(?:php|=)[\s\S]*?\?>/g, '');
}

function extractHeadStyles(raw) {
  const headMatch = raw.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (!headMatch) return '';
  const headContent = headMatch[1];
  const styleMatches = headContent.match(/<style\b[^>]*>[\s\S]*?<\/style>/gi);
  return styleMatches ? styleMatches.join('\n') : '';
}

function stripHeadAndHtml(html) {
  let body = html.replace(/<!DOCTYPE html>[\s\S]*?<body[^>]*>/i, '');
  body = body.replace(/<\/body>[\s\S]*?<\/html>/i, '');
  return body.trim();
}

function stripScripts(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
}

function stripHeader(html) {
  return html.replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi, '');
}

function stripGetAQuote(html) {
  return html.replace(/<section\b[^>]*class="[^"]*get-a-quote[^"]*"[^>]*>[\s\S]*?<\/section>/gi, '');
}

function loadView(fileName) {
  const filePath = path.join(viewsDir, fileName);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const headStyles = extractHeadStyles(raw);
  let html = raw;
  html = normalizeAssetPaths(html);

  // Handle includes before removing PHP
  if (fileName === 'publishing-service.php') {
    const testimonialsPath = path.join(subprojectRoot, 'includes', 'testimonials.2.php');
    const testimonialsRaw = fs.readFileSync(testimonialsPath, 'utf-8');
    let testimonialsHtml = testimonialsRaw;
    testimonialsHtml = normalizeAssetPaths(testimonialsHtml);
    testimonialsHtml = stripScripts(testimonialsHtml);
    testimonialsHtml = testimonialsHtml.replace(/<\?(?:php|=)[\s\S]*?\?>/g, '');

    html = html.replace(/<\?php[\s\S]*?include_once\((['"])includes\/testimonials\.2\.php\1\);[\s\S]*?\?>/g, testimonialsHtml);
  }

  html = removePhp(html);
  html = stripHeader(html);
  html = stripGetAQuote(html);
  html = stripScripts(html);
  html = stripHeadAndHtml(html);
  return {
    html: headStyles + '\n' + html,
  };
}

export function getPublishingServiceHtml() {
  return loadView('publishing-service.php');
}

export function getThankYouHtml() {
  return loadView('thank-you.php');
}
