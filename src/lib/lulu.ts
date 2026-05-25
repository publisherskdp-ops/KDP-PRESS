// Lulu API Access Token Interface

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
    this.authUrl = process.env.LULU_AUTH_URL || 'https://api.sandbox.lulu.com/auth/realms/glasstree/protocol/openid-connect/token';
    this.apiUrl = process.env.LULU_API_BASE_URL || 'https://api.sandbox.lulu.com';
  }

  /**
   * Fetches a new access token using Client Credentials Flow with OAuth2
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
      console.log('Lulu Authentication Response:', response);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Lulu Authentication Error:', errorData);
        throw new Error(`Failed to authenticate with Lulu API: ${response.statusText}`);
      }

      const tokenData: LuluAccessToken = await response.json();
      this.accessToken = tokenData.access_token;
      
      // Set local expiry slightly earlier (60 seconds) to avoid network latency race conditions
      this.tokenExpiry = Date.now() + (tokenData.expires_in - 60) * 1000;
      
      return this.accessToken;
    } catch (error) {
      console.error('Lulu Auth Exception:', error);
      throw error;
    }
  }

  /**
   * Helper utility for signing and executing HTTP requests securely
   */
  private async request(endpoint: string, options: RequestInit = {}) {
    const token = await this.getAccessToken();
    console.log(`[LULU API REQUEST] Endpoint: ${endpoint}`, options);
    
    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) { 
      const errorData = await response.json().catch(() => ({}));
      console.error(`[LULU API ERROR] Endpoint: ${endpoint}`, {
        status: response.status,
        statusText: response.statusText,
       error: JSON.stringify(errorData, null, 2)
      });
      
      // Create error with detailed information
      const error = new Error(`Lulu API request failed: ${response.statusText}`);
      (error as any).luluErrorDetails = errorData;
      (error as any).luluStatus = response.status;
      throw error;
    }

    const data = await response.json();
    console.log(`[LULU API SUCCESS] Endpoint: ${endpoint}`);
    return data;
  }

  /**
   * Calculate exact physical shipping costs for a set of print items
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
   * Registers a Print-On-Demand (POD) job under the publisher account
   */
  async createPrintJob(jobData: Partial<LuluPrintJob>): Promise<LuluPrintJob> {
    console.log('🚀 ~ LuluService ~ createPrintJob ~ jobData:', jobData)
    return this.request('/print-jobs/', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  } 

  

  /**
   * Fetches full status details of a specific print job
   */
  async getPrintJob(id: number): Promise<LuluPrintJob> {
    return this.request(`/print-jobs/${id}/`);
  }

  /**
   * Fetches a paginated list of all print jobs
   */
  async listPrintJobs(page = 1, pageSize = 20): Promise<{ results: LuluPrintJob[], count: number }> {
    return this.request(`/print-jobs/?page=${page}&page_size=${pageSize}`);
  }
}

export const lulu = new LuluService();