import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import { AppLayout } from '@/app/layout/AppLayout';
import { AuthLayout } from '@/app/layout/AuthLayout';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { DashboardPage } from '@/features/aquariums/pages/DashboardPage';
import { AquariumDetailPage } from '@/features/aquariums/pages/AquariumDetailPage';
import { AccountPage } from '@/features/account/pages/AccountPage';

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="aquariums/:aquariumId" element={<AquariumDetailPage />} />
        <Route path="account" element={<AccountPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);
