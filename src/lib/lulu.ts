
export interface LuluAccessToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface LuluPrintJob {
  id: number;
  status: string;
  contact_email: string;
  external_id: string;
  line_items: any[];
  shipping_address: any;
  shipping_level: string;
}

class LuluService {
  private clientId: string;
  private clientSecret: string;
  private authUrl: string;
  private apiUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor() {
    this.clientId = process.env.LULU_CLIENT_KEY || '';
    this.clientSecret = process.env.LULU_CLIENT_SECRET || '';
    this.authUrl = process.env.LULU_AUTH_URL || 'https://auth.sandbox.lulu.com/auth/realms/glasstree/protocol/openid-connect/token';
    this.apiUrl = process.env.LULU_API_BASE_URL || 'https://api.sandbox.lulu.com';
  }

  /**
   * Fetches a new access token using Client Credentials Flow
   */
  async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const authHeader = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    
    try {
      const response = await fetch(this.authUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Lulu Auth Error:', errorData);
        throw new Error(`Failed to authenticate with Lulu: ${response.statusText}`);
      }

      const data: LuluAccessToken = await response.json();
      this.accessToken = data.access_token;
      // Set expiry slightly earlier than actual to avoid race conditions
      this.tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
      
      return this.accessToken;
    } catch (error) {
      console.error('Lulu Auth Exception:', error);
      throw error;
    }
  }

  /**
   * Helper for authenticated API calls
   */
  private async request(endpoint: string, options: RequestInit = {}) {
    const token = await this.getAccessToken();
    
    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Lulu API Error (${endpoint}):`, errorData);
      throw new Error(`Lulu API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Calculate shipping costs for a set of items
   */
  async calculateShipping(shippingAddress: any, lineItems: any[]) {
    return this.request('/calculations/shipping/', {
      method: 'POST',
      body: JSON.stringify({
        shipping_address: shippingAddress,
        line_items: lineItems,
      }),
    });
  }

  /**
   * Create a new print job
   */
  async createPrintJob(jobData: Partial<LuluPrintJob>) {
    return this.request('/print-jobs/', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  /**
   * Get details of a print job
   */
  async getPrintJob(id: number) {
    return this.request(`/print-jobs/${id}/`);
  }
}

export const lulu = new LuluService();
