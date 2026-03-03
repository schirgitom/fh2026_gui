import { useMutation } from '@tanstack/react-query';
import { authApi, LoginPayload, RegisterPayload } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/features/auth/store/authStore';

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      setAuth(data.token, data.user);
    }
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload)
  });
};
