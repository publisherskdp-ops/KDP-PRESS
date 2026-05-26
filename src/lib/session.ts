// Web Crypto-based session utility, 100% compatible with Next.js Edge Runtime (Middleware)
// Uses HMAC SHA-256 to sign and verify cookies without any external dependencies.

const SESSION_SECRET = process.env.SESSION_SECRET || 'kdp-press-super-secret-key-for-session-signing-123456';
const encoder = new TextEncoder();

async function getSignature(data: string, secret: string): Promise<string> {
  const keyBuffer = encoder.encode(secret);
  const dataBuffer = encoder.encode(data);
  
  const key = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, dataBuffer);
  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function signSession(payload: any, expiresInDays: number = 7): Promise<string> {
  const exp = Date.now() + expiresInDays * 24 * 60 * 60 * 1000;
  const sessionData = {
    ...payload,
    exp
  };
  
  const dataStr = JSON.stringify(sessionData);
  // Base64 encode the payload safely
  const encodedPayload = typeof btoa !== 'undefined' 
    ? btoa(unescape(encodeURIComponent(dataStr)))
    : Buffer.from(dataStr).toString('base64');
    
  const signature = await getSignature(encodedPayload, SESSION_SECRET);
  return `${encodedPayload}.${signature}`;
}

export async function verifySession(token: string): Promise<any | null> {
  try {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    
    const [encodedPayload, signature] = parts;
    const expectedSignature = await getSignature(encodedPayload, SESSION_SECRET);
    
    if (signature === expectedSignature) {
      const decodedStr = typeof atob !== 'undefined'
        ? decodeURIComponent(escape(atob(encodedPayload)))
        : Buffer.from(encodedPayload, 'base64').toString('utf8');
        
      const payload = JSON.parse(decodedStr);
      
      // Check expiration
      if (payload.exp && Date.now() > payload.exp) {
        return null;
      }
      
      return payload;
    }
  } catch (e) {
    console.error('Session verification failed:', e);
    return null;
  }
  return null;
}
