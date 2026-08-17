import { supabaseAdmin } from '../config/supabase';
import { prisma } from '../config/prisma';
import { AppError } from '../middleware/errorHandler';
import { ErrorCode } from '../types';
import { LoginInput } from '../validators/auth.validator';

export const authService = {
  /**
   * Login with email + password via Supabase Auth
   * Returns the Supabase session (access_token, refresh_token, user)
   */
  async login(input: LoginInput) {
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error || !data.session) {
      throw new AppError(
        'Invalid email or password',
        401,
        ErrorCode.UNAUTHORIZED
      );
    }

    // Ensure user exists in our DB
    const dbUser = await prisma.user.findUnique({
      where: { supabaseUid: data.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    if (!dbUser || !dbUser.isActive) {
      throw new AppError(
        'Account not found or deactivated. Contact administrator.',
        401,
        ErrorCode.UNAUTHORIZED
      );
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at,
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
      },
    };
  },

  /**
   * Logout — revokes the Supabase session server-side
   */
  async logout(accessToken: string) {
    await supabaseAdmin.auth.admin.signOut(accessToken);
  },

  /**
   * Get current user profile from our DB
   */
  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404, ErrorCode.NOT_FOUND);
    }

    return user;
  },
};
