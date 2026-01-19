import { mockApi } from './mock/mockApi';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  Product,
  ProductFilters,
  CreateProductRequest,
  UpdateProductRequest,
  Purchase,
  PurchaseFilters,
  CreatePurchaseRequest,
  ScanQRCodeRequest,
  AnalyticsData,
  AnalyticsParams,
  Testimonial,
  TestimonialFilters,
  Notification,
  NotificationFilters,
  ApiResponse,
  ApiError,
  ApiResult,
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';
const ENABLE_MOCK_DATA = import.meta.env.VITE_ENABLE_MOCK_DATA === 'true';

// Helper function to build query string
function buildQueryString(params?: Record<string, any>): string {
  if (!params || Object.keys(params).length === 0) {
    return '';
  }

  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });

  return `?${queryParams.toString()}`;
}

// Helper function to make API requests
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<ApiResult<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      return { success: false, error };
    }

    return response.json();
  } catch (error) {
    return {
      success: false, // Type 'false' is not assignable to type 'true'. - this error suggests ApiResponse success might be typed as true for data case? No, usually generic. 
      // Wait, if ApiResponse is defined as `Success<T> | Failure`, and Failure has success: false.
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

// API service that switches between mock and real API
export const api = {
  // Authentication
  login: async (credentials: LoginRequest): Promise<ApiResult<LoginResponse>> => {
    // Hardcoded credentials access
    if (credentials.email === 'rauldev@vendas.com' && credentials.password === 'Braslog!23') {
      return {
        success: true,
        data: {
          user: {
            id: 'seller-123',
            name: 'Raul Vendedor',
            email: 'rauldev@vendas.com',
            role: 'seller',
            isActive: true,
            password: '', // Mock password
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          token: 'mock-seller-token-abc-123',
          expiresIn: 86400,
        }
      };
    }
    if (credentials.email === 'rauldev@compras.com' && credentials.password === 'Braslog!23') {
      return {
        success: true,
        data: {
          user: {
            id: 'buyer-123',
            name: 'Raul Comprador',
            email: 'rauldev@compras.com',
            role: 'buyer',
            isActive: true, // Added
            password: '',   // Added
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          token: 'mock-buyer-token-xyz-789',
          expiresIn: 86400,
        }
      };
    }

    if (ENABLE_MOCK_DATA) {
      return mockApi.login(credentials);
    }
    return fetchApi<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  logout: async (): Promise<ApiResult<{ message: string }>> => {
    if (ENABLE_MOCK_DATA) {
      return mockApi.logout();
    }
    return fetchApi<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  },

  register: async (data: RegisterRequest): Promise<ApiResult<LoginResponse>> => {
    if (ENABLE_MOCK_DATA) {
      return mockApi.register(data);
    }
    return fetchApi<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMe: async (): Promise<ApiResult<User>> => {
    if (ENABLE_MOCK_DATA) {
      return mockApi.getMe();
    }
    return fetchApi<User>('/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },

  // Products
  getProducts: async (filters?: ProductFilters): Promise<ApiResult<{ products: Product[]; pagination: any }>> => {
    if (ENABLE_MOCK_DATA) {
      return mockApi.getProducts(filters);
    }
    return fetchApi<{ products: Product[]; pagination: any }>(
      `/products${buildQueryString(filters)}`,
      {
        method: 'GET',
      },
    );
  },

  getProduct: async (id: string): Promise<ApiResult<Product>> => {
    if (ENABLE_MOCK_DATA) {
      return mockApi.getProduct(id);
    }
    return fetchApi<Product>(`/products/${id}`, {
      method: 'GET',
    });
  },

  createProduct: async (data: CreateProductRequest): Promise<ApiResult<Product>> => {
    if (ENABLE_MOCK_DATA) {
      return mockApi.createProduct(data);
    }
    return fetchApi<Product>('/products', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });
  },

  updateProduct: async (
    id: string,
    data: UpdateProductRequest,
  ): Promise<ApiResult<Product>> => {
    if (ENABLE_MOCK_DATA) {
      return mockApi.updateProduct(id, data);
    }
    return fetchApi<Product>(`/products/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });
  },

  deleteProduct: async (id: string): Promise<ApiResult<{ message: string }>> => {
    if (ENABLE_MOCK_DATA) {
      return mockApi.deleteProduct(id);
    }
    return fetchApi<{ message: string }>(`/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },

  // QR Codes
  getQRCode: async (productId: string): Promise<ApiResult<any>> => {
    if (ENABLE_MOCK_DATA) {
      return mockApi.getQRCode(productId);
    }
    return fetchApi<any>(`/qr-codes/${productId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },

  scanQRCode: async (
    data: ScanQRCodeRequest,
  ): Promise<ApiResult<{ product: Product; seller: User }>> => {
    if (ENABLE_MOCK_DATA) {
      return mockApi.scanQRCode(data);
    }
    return fetchApi<{ product: Product; seller: User }>('/qr-codes/scan', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });
  },

  // Purchases
  getPurchases: async (filters?: PurchaseFilters): Promise<ApiResult<{ purchases: Purchase[]; pagination: any }>> => {
    if (ENABLE_MOCK_DATA) {
      return mockApi.getPurchases(filters);
    }
    return fetchApi<{ purchases: Purchase[]; pagination: any }>(
      `/purchases${buildQueryString(filters)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    );
  },

  getPurchase: async (id: string): Promise<ApiResult<Purchase>> => {
    if (ENABLE_MOCK_DATA) {
      return mockApi.getPurchase(id);
    }
    return fetchApi<Purchase>(`/purchases/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },

  createPurchase: async (
    data: CreatePurchaseRequest,
  ): Promise<ApiResult<Purchase>> => {
    if (ENABLE_MOCK_DATA) {
      return mockApi.createPurchase(data);
    }
    return fetchApi<Purchase>('/purchases', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });
  },

  // Analytics
  getSellerAnalytics: async (
    params?: AnalyticsParams,
  ): Promise<ApiResult<AnalyticsData>> => {
    if (ENABLE_MOCK_DATA) {
      return mockApi.getSellerAnalytics(params);
    }
    return fetchApi<AnalyticsData>(`/analytics/seller${buildQueryString(params)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },

  // Testimonials
  getTestimonials: async (
    filters?: TestimonialFilters,
  ): Promise<ApiResult<Testimonial[]>> => {
    if (ENABLE_MOCK_DATA) {
      return mockApi.getTestimonials(filters);
    }
    return fetchApi<Testimonial[]>(`/testimonials${buildQueryString(filters)}`, {
      method: 'GET',
    });
  },

  // Notifications
  getNotifications: async (
    filters?: NotificationFilters,
  ): Promise<ApiResult<Notification[]>> => {
    if (ENABLE_MOCK_DATA) {
      return mockApi.getNotifications(filters);
    }
    return fetchApi<Notification[]>(`/notifications${buildQueryString(filters)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },

  markNotificationAsRead: async (id: string): Promise<ApiResult<Notification>> => {
    if (ENABLE_MOCK_DATA) {
      return mockApi.markNotificationAsRead(id);
    }
    return fetchApi<Notification>(`/notifications/${id}/read`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },

  markAllNotificationsAsRead: async (): Promise<ApiResult<{ message: string }>> => {
    if (ENABLE_MOCK_DATA) {
      return mockApi.markAllNotificationsAsRead();
    }
    return fetchApi<{ message: string }>('/notifications/read-all', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
};
