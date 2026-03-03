import { useState } from 'react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { Button } from '@/shared/ui/Button';

interface TopbarProps {
  onMenuToggle: () => void;
}

export const Topbar = ({ onMenuToggle }: TopbarProps) => {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [open, setOpen] = useState(false);

  return (
    <header className="flex items-center justify-between gap-4 border-b border-ink-100 bg-white px-6 py-4">
      <div className="flex items-center gap-3">
        <button className="lg:hidden" onClick={onMenuToggle} aria-label="Open menu">
          ☰
        </button>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-ink-400">Status</p>
          <p className="text-sm font-semibold text-ink-900">Balanced & Stable</p>
        </div>
      </div>
      <div className="relative">
        <button
          className="flex items-center gap-2 rounded-full bg-ink-50 px-4 py-2 text-sm font-medium text-ink-700"
          onClick={() => setOpen((prev) => !prev)}
        >
          {user?.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : user?.email ?? 'User'}
          <span className="text-xs">▾</span>
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-44 rounded-xl border border-ink-100 bg-white p-2 shadow-soft">
            <Button variant="ghost" className="w-full justify-start" onClick={clearAuth}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
