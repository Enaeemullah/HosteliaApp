import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/hostels', label: 'Hostels' },
  { to: '/rooms', label: 'Rooms' },
  { to: '/students', label: 'Students' },
  { to: '/fees', label: 'Fees' },
];

export const Sidebar = () => (
  <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
    <div className="px-6 py-4 text-2xl font-bold text-primary">Hostelia</div>
    <nav className="flex-1 space-y-1 px-4">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `block rounded-lg px-3 py-2 text-sm font-medium ${
              isActive ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);
