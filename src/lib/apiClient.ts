/**
 * Centralized REST API Client Abstraction
 * Fully integrated with Express backend (/api/v1).
 * Features:
 * - JWT Authorization header propagation
 * - Standardized contract response wrapping
 * - Unified error handling
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export interface ApiResponseWrapper<T> {
  success: boolean;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
  code?: string;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponseWrapper<T>> {
  const token = localStorage.getItem('auth_token') || localStorage.getItem('token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = res.headers.get('content-type');
    let json: any = {};
    if (contentType && contentType.includes('application/json')) {
      json = await res.json();
    } else {
      const text = await res.text();
      json = { message: text };
    }

    if (!res.ok) {
      return {
        success: false,
        data: json.data || null,
        message: json.message || `HTTP ${res.status}: ${res.statusText}`,
        code: json.code || 'HTTP_ERROR',
      };
    }

    return {
      success: json.success ?? true,
      data: json.data ?? json,
      pagination: json.pagination,
      message: json.message,
    };
  } catch (error: any) {
    console.warn(`[API Client Network Notice] Call to ${url} failed:`, error.message);
    throw error;
  }
}

export { API_BASE_URL };
