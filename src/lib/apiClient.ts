/**
 * Centralized REST API Client Abstraction
 * Prepared for future REST backend integration (/api/v1).
 * In Phase 1, network calls are abstracted while service calls return strongly typed mock responses.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data: T; message?: string }> {
  // Phase 1: Ready structure for future REST calls.
  // When backend is online in Phase 2, this will execute fetch(`${API_BASE_URL}${endpoint}`, options)
  console.log(`[API CLIENT READY] Endpoint prepared: ${API_BASE_URL}${endpoint}`);
  throw new Error('Real REST API connection is scheduled for Phase 2. Currently operating in pure mock mode.');
}

export { API_BASE_URL };
