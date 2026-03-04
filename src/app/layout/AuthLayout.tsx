import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useI18n } from '@/i18n/LanguageProvider';

export const AuthLayout = () => {
  const token = useAuthStore((state) => state.token);
  const location = useLocation();
  const { t } = useI18n();

  if (token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sea-50 via-white to-ink-100">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-16">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-center gap-6">
            <p className="subheading">{t('auth.brand')}</p>
            <h1 className="text-4xl font-semibold text-ink-900 md:text-5xl">{t('auth.heroTitle')}</h1>
            <p className="text-lg text-ink-600">{t('auth.heroDescription')}</p>
          </div>
          <div className="card p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
