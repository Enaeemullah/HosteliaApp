import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useHostels } from '../../hooks/useHostels';

const makeIcon = (paths: JSX.Element) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    {paths}
  </svg>
);

const links = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: makeIcon(
      <>
        <rect
          x="3"
          y="3"
          width="8"
          height="8"
          rx="1.4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="13"
          y="3"
          width="8"
          height="5"
          rx="1.4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="13"
          y="10"
          width="8"
          height="11"
          rx="1.4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="3"
          y="13"
          width="8"
          height="8"
          rx="1.4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>,
    ),
  },
  {
    to: '/hostels',
    label: 'Hostels',
    icon: makeIcon(
      <>
        <path
          d="M5 21V9l7-5 7 5v12"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 21v-6h6v6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 21h18"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>,
    ),
  },
  {
    to: '/rooms',
    label: 'Rooms',
    icon: makeIcon(
      <>
        <path
          d="M4 21V9"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 17h16"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="8"
          y="10"
          width="6"
          height="4"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 13h10a4 4 0 0 1 4 4v4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>,
    ),
  },
  {
    to: '/students',
    label: 'Students',
    icon: makeIcon(
      <>
        <circle
          cx="12"
          cy="8"
          r="4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 20c0-4 3.2-6 8-6s8 2 8 6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>,
    ),
  },
  {
    to: '/fees',
    label: 'Fees',
    icon: makeIcon(
      <>
        <path
          d="M9 7h7a3 3 0 1 1 0 6h-5a3 3 0 1 0 0 6h7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="12"
          y1="3"
          x2="12"
          y2="21"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>,
    ),
  },
];

export const Sidebar = () => {
  const { hostels } = useHostels();
  const [logoErrored, setLogoErrored] = useState(false);
  const primaryHostel = hostels[0];
  const logoUrl = primaryHostel?.logoUrl ?? null;
  const showLogo = !!logoUrl && !logoErrored;

  useEffect(() => {
    setLogoErrored(false);
  }, [logoUrl]);

  return (
    <aside className="mono-sidebar">
      <div>
        <p className="mono-sidebar__brand">Hostelia</p>
        {showLogo && (
          <img
            src={logoUrl ?? undefined}
            alt={`${primaryHostel?.name ?? 'Hostel'} logo`}
            className="mono-sidebar__logo"
            onError={() => setLogoErrored(true)}
          />
        )}
        <p className="mono-sidebar__title">Control Center</p>
      </div>

      <nav className="mono-sidebar__nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => ['mono-nav-link', isActive ? 'is-active' : ''].join(' ').trim()}
          >
            <span className="mono-nav-link__icon">{link.icon}</span>
            <span className="mono-nav-link__label">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <p className="mono-sidebar__footer">Operate, release, and monitor.</p>
    </aside>
  );
};
