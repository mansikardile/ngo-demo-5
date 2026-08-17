import { mockUsers } from '../mock/users';
import { User, UserRole, ApiResponse } from '../types';

export const authService = {
  async login(email: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || mockUsers[0];
    return {
      success: true,
      data: {
        user,
        token: `mock-jwt-token-for-${user.role.toLowerCase()}`,
      },
    };
  },

  async switchRole(role: UserRole): Promise<ApiResponse<User>> {
    const user = mockUsers.find((u) => u.role === role) || mockUsers[0];
    return {
      success: true,
      data: user,
    };
  },

  async me(): Promise<ApiResponse<User>> {
    return {
      success: true,
      data: mockUsers[0],
    };
  },
};
