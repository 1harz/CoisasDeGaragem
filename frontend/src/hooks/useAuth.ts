import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/services/api';

export function useAuth() {
  const { user, token, isAuthenticated, login, logout, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      const result = await api.login({ email, password });

      if (result.success) {
        const { user: userData, token: userToken } = result.data;
        login(userData, userToken);
        localStorage.setItem('token', userToken);

        // Redirect based on role
        const redirectPath = userData.role === 'seller' ? '/seller/dashboard' : '/buyer/qr-scanner';
        navigate(redirectPath, { replace: true });
      } else {
        throw new Error(result.error.message);
      }
    },
    [login, navigate],
  );

  const handleRegister = useCallback(
    async (email: string, password: string, name: string, role: 'seller' | 'buyer', phone?: string) => {
      const result = await api.register({ email, password, name, role, phone });

      if (result.success) {
        const { user: userData, token: userToken } = result.data;
        login(userData, userToken);
        localStorage.setItem('token', userToken);

        // Redirect based on role
        const redirectPath = userData.role === 'seller' ? '/seller/dashboard' : '/buyer/qr-scanner';
        navigate(redirectPath, { replace: true });
      } else {
        throw new Error(result.error.message);
      }
    },
    [login, navigate],
  );

  const handleLogout = useCallback(() => {
    api.logout();
    logout();
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  }, [logout, navigate]);

  const handleUpdateProfile = useCallback(
    async (updates: { name?: string; phone?: string; avatarUrl?: string }) => {
      if (!user) return;

      const result = await api.getMe();

      if (result.success) {
        updateUser(updates);
      } else {
        throw new Error(result.error.message);
      }
    },
    [user, updateUser],
  );

  return {
    user,
    token,
    isAuthenticated,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
  };
}
