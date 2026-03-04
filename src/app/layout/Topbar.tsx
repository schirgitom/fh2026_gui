import { useState } from 'react';
import clsx from 'clsx';
import { useAuthStore } from '@/features/auth/store/authStore';
import { Button } from '@/shared/ui/Button';
import { useI18n } from '@/i18n/LanguageProvider';

interface TopbarProps {
  onMenuToggle: () => void;
}

export const Topbar = ({ onMenuToggle }: TopbarProps) => {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const { language, setLanguage, t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <header className="flex items-center justify-between gap-4 border-b border-ink-100 bg-white px-6 py-4">
      <div className="flex items-center gap-3">
        <button className="lg:hidden" onClick={onMenuToggle} aria-label={t('common.openMenu')}>
          ☰
        </button>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-ink-400">{t('topbar.status')}</p>
          <p className="text-sm font-semibold text-ink-900">{t('topbar.statusValue')}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full bg-ink-50 px-2 py-1">
          <span className="px-2 text-xs font-medium text-ink-500">{t('language.label')}</span>
          <button
            className={clsx(
              'rounded-full px-3 py-1 text-xs font-semibold transition',
              language === 'de' ? 'bg-sea-600 text-white' : 'text-ink-600 hover:bg-ink-100'
            )}
            onClick={() => setLanguage('de')}
            type="button"
          >
            DE
          </button>
          <button
            className={clsx(
              'rounded-full px-3 py-1 text-xs font-semibold transition',
              language === 'en' ? 'bg-sea-600 text-white' : 'text-ink-600 hover:bg-ink-100'
            )}
            onClick={() => setLanguage('en')}
            type="button"
          >
            EN
          </button>
        </div>

        <div className="relative">
          <button
            className="flex items-center gap-2 rounded-full bg-ink-50 px-4 py-2 text-sm font-medium text-ink-700"
            onClick={() => setOpen((prev) => !prev)}
          >
            {user?.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : user?.email ?? t('common.user')}
            <span className="text-xs">▾</span>
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-44 rounded-xl border border-ink-100 bg-white p-2 shadow-soft">
              <Button variant="ghost" className="w-full justify-start" onClick={clearAuth}>
                {t('topbar.logout')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
