import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { label: 'Dashboard', to: '/' }
];

export const Sidebar = ({ open, onClose }: SidebarProps) => (
  <aside
    className={clsx(
      'fixed inset-y-0 left-0 z-40 w-64 transform bg-ink-900 text-white transition-transform lg:static lg:translate-x-0',
      open ? 'translate-x-0' : '-translate-x-full'
    )}
  >
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-6 py-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-sea-200">Aquarium</p>
          <p className="text-lg font-semibold">Control Room</p>
        </div>
        <button className="lg:hidden" onClick={onClose} aria-label="Close sidebar">
          ✕
        </button>
      </div>

      <nav className="flex-1 space-y-2 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
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
      </nav>

      <div className="px-6 py-6 text-xs text-sea-200">
        Built for clarity and care.
      </div>
    </div>
  </aside>
);
