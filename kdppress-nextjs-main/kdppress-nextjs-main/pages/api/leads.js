import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export const config = {
  api: {
    bodyParser: false,
  },
};

function getRealIpAddress(req) {
  const headers = req.headers;
  if (headers['x-real-ip']) {
    return headers['x-real-ip'];
  }
  if (headers['x-forwarded-for']) {
    const forwarded = headers['x-forwarded-for'].split(',').map((ip) => ip.trim());
    return forwarded.find((ip) => ip) || req.socket.remoteAddress || 'UNKNOWN';
  }
  return req.socket.remoteAddress || 'UNKNOWN';
}

function getBrowserFingerprint(req, fields) {
  let fingerprint = '';
  const headers = req.headers;

  if (headers['user-agent']) fingerprint += headers['user-agent'];
  if (headers.accept) fingerprint += headers.accept;
  if (headers['accept-language']) fingerprint += headers['accept-language'];
  if (headers['accept-encoding']) fingerprint += headers['accept-encoding'];

  if (fields.screen_width) fingerprint += fields.screen_width;
  if (fields.screen_height) fingerprint += fields.screen_height;
  if (fields.timezone_offset) fingerprint += fields.timezone_offset;
  if (fields.canvas_fp) fingerprint += fields.canvas_fp;
  if (fields.webgl_fp) fingerprint += fields.webgl_fp;
  if (fields.plugins) fingerprint += fields.plugins;
  if (fields.fonts) fingerprint += fields.fonts;

  return crypto.createHash('md5').update(fingerprint).digest('hex');
}

function normalizeField(value) {
  if (Array.isArray(value)) {
    return value[0] || '';
  }
  return value || '';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const uploadDir = path.join(process.cwd(), 'uploads');
  const logsDir = path.join(uploadDir, 'logs');
  await fs.promises.mkdir(logsDir, { recursive: true });
  await fs.promises.mkdir(uploadDir, { recursive: true });

  const form = new formidable.IncomingForm({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 50 * 1024 * 1024,
    multiples: false,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('formidable parse error:', err);
      res.writeHead(302, { Location: '/errors/' });
      res.end();
      return;
    }

    const firstName = normalizeField(fields.first_name);
    const lastName = normalizeField(fields.last_name);
    const email = normalizeField(fields.email);
    const phone = normalizeField(fields.phone);
    let brief = normalizeField(fields.brief);
    const route = normalizeField(fields.route);

    if (!firstName || !email || !phone) {
      res.writeHead(302, { Location: '/errors/' });
      res.end();
      return;
    }

    if (phone === '5556660606' || phone === '555-666-0606') {
      res.writeHead(302, { Location: '/' });
      res.end();
      return;
    }

    const clientIp = getRealIpAddress(req);
    const browserFingerprint = getBrowserFingerprint(req, fields);

    const logFile = path.join(logsDir, 'submission_log.json');
    let logData = [];

    try {
      if (fs.existsSync(logFile)) {
        const raw = await fs.promises.readFile(logFile, 'utf-8');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            logData = parsed;
          }
        }
      }
    } catch (readError) {
      console.warn('Could not read submission log:', readError);
    }

    const timeWindow = 86400;
    logData = logData.filter((entry) => {
      if (!entry || typeof entry !== 'object' || !entry.timestamp) {
        return false;
      }
      return Date.now() / 1000 - entry.timestamp < timeWindow;
    });

    const data = {
      name: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      brief,
      domain: 'www.kdpPress.com',
      brand: 'www.kdpPress.com',
      ip_address: clientIp,
      route,
    };

    if (files.manuscript && files.manuscript.filepath) {
      const manuscript = files.manuscript;
      const fileName = path.basename(manuscript.originalFilename || manuscript.newFilename || manuscript.filepath);
      const fileUrl = `${req.headers['x-forwarded-proto'] || (req.connection.encrypted ? 'https' : 'http')}://${req.headers.host}/uploads/${encodeURIComponent(fileName)}`;
      data.manuscript_url = fileUrl;
      brief = `${brief} | Manuscript: ${fileUrl}`;
      data.brief = brief;
    }

    logData.push({
      ip: clientIp,
      fingerprint: browserFingerprint,
      timestamp: Math.floor(Date.now() / 1000),
    });

    try {
      await fs.promises.writeFile(logFile, JSON.stringify(logData, null, 2), 'utf-8');
    } catch (writeError) {
      console.warn('Could not write submission log:', writeError);
    }

    try {
      const response = await fetch('https://savtrack.savtechglobal.com/api/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Webhook request failed');
      }
    } catch (apiError) {
      console.error('API request failed:', apiError);
      res.writeHead(302, { Location: '/errors/' });
      res.end();
      return;
    }

    res.writeHead(302, { Location: '/thank-you/' });
    res.end();
  });
}
