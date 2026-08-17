import { mockUsers } from '../mock/users';
import { User, UserRole, ApiResponse } from '../types';
import { apiRequest } from '../lib/apiClient';

export const authService = {
  async login(email: string, password = 'Admin@12345'): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const res = await apiRequest<{
        accessToken: string;
        refreshToken?: string;
        expiresAt?: number;
        user: User;
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (res.success && res.data?.accessToken) {
        localStorage.setItem('auth_token', res.data.accessToken);
        localStorage.setItem('ngo_user', JSON.stringify(res.data.user));
        return {
          success: true,
          data: {
            user: res.data.user,
            token: res.data.accessToken,
          },
        };
      }
    } catch (err) {
      console.warn('[authService] Backend auth unavailable or error, using mock fallback:', err);
    }

    // Fallback to mock login if backend is unreachable or returns error
    const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || mockUsers[0];
    const mockToken = `mock-jwt-token-for-${user.role.toLowerCase()}`;
    localStorage.setItem('auth_token', mockToken);
    localStorage.setItem('ngo_user', JSON.stringify(user));
    return {
      success: true,
      data: {
        user,
        token: mockToken,
      },
    };
  },

  async logout(): Promise<ApiResponse<boolean>> {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network error on logout
    }
    localStorage.removeItem('auth_token');
    localStorage.removeItem('ngo_user');
    return { success: true, data: true };
  },

  async switchRole(role: UserRole): Promise<ApiResponse<User>> {
    const user = mockUsers.find((u) => u.role === role) || {
      ...mockUsers[0],
      role,
      name: `${role} User`,
    };
    localStorage.setItem('ngo_user', JSON.stringify(user));
    return {
      success: true,
      data: user,
    };
  },

  async me(): Promise<ApiResponse<User>> {
    try {
      const res = await apiRequest<User>('/auth/me');
      if (res.success && res.data) {
        return { success: true, data: res.data };
      }
    } catch {
      // Fallback
    }

    const saved = localStorage.getItem('ngo_user');
    const user = saved ? JSON.parse(saved) : mockUsers[0];
    return {
      success: true,
      data: user,
    };
  },
};
