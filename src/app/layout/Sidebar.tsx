import { NavLink, useLocation, useMatch, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { useI18n } from '@/i18n/LanguageProvider';
import { useAquariums } from '@/features/aquariums/hooks/useAquariums';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export const Sidebar = ({ open, onClose }: SidebarProps) => {
  const { t } = useI18n();
  const location = useLocation();
  const routeMatch = useMatch('/aquariums/:aquariumId');
  const { aquariumId } = useParams();
  const { data: aquariums } = useAquariums();
  const aquarium = aquariums?.find((item) => item.id === aquariumId);
  const isFreshwater = aquarium?.type === 'freshwater';

  const navItems = [{ label: t('sidebar.dashboard'), to: '/', end: true }];
  const detailNavItems = routeMatch
    ? [
        { label: t('detail.tabs.overview'), to: `${routeMatch.pathname}?tab=overview` },
        { label: t('detail.tabs.fish'), to: `${routeMatch.pathname}?tab=fish` },
        ...(!isFreshwater
          ? [{ label: t('detail.tabs.corals'), to: `${routeMatch.pathname}?tab=corals` }]
          : []),
        { label: t('detail.tabs.images'), to: `${routeMatch.pathname}?tab=images` },
        { label: t('detail.tabs.measurements'), to: `${routeMatch.pathname}?tab=measurements` }
      ]
    : [];

  return (
    <aside
      className={clsx(
        'fixed inset-y-0 left-0 z-40 w-64 transform bg-ink-900 text-white transition-transform lg:static lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-6 py-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sea-200">{t('sidebar.aquarium')}</p>
            <p className="text-lg font-semibold">{t('sidebar.controlRoom')}</p>
          </div>
          <button className="lg:hidden" onClick={onClose} aria-label={t('common.closeMenu')}>
            ✕
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition',
                  isActive ? 'bg-sea-600 text-white' : 'text-sea-100 hover:bg-ink-800'
                )
              }
            >
              <span className="h-2 w-2 rounded-full bg-sea-300"></span>
              {item.label}
            </NavLink>
          ))}

          {detailNavItems.length > 0 && (
            <div className="pt-4">
              {detailNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={clsx(
                    'mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition',
                    location.pathname + location.search === item.to
                      ? 'bg-sea-600 text-white'
                      : 'text-sea-100 hover:bg-ink-800'
                  )}
                >
                  <span className="h-2 w-2 rounded-full bg-sea-300"></span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          )}
        </nav>

        <div className="px-6 py-6 text-xs text-sea-200">{t('sidebar.footer')}</div>
      </div>
    </aside>
  );
};
