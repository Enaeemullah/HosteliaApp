import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/hostels', label: 'Hostels' },
  { to: '/rooms', label: 'Rooms' },
  { to: '/students', label: 'Students' },
  { to: '/fees', label: 'Fees' },
];

export const Sidebar = () => (
  <aside className="mono-sidebar">
    <div>
      <p className="mono-sidebar__brand">Hostelia</p>
      <p className="mono-sidebar__title">Control Center</p>
    </div>

    <nav className="mono-sidebar__nav">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => ['mono-nav-link', isActive ? 'is-active' : ''].join(' ').trim()}
        >
          {link.label}
        </NavLink>
      ))}
    </nav>

    <p className="mono-sidebar__footer">Operate, release, and monitor.</p>
  </aside>
);
