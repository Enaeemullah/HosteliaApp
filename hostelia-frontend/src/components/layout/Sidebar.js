import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from 'react-router-dom';
const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/hostels', label: 'Hostels' },
    { to: '/rooms', label: 'Rooms' },
    { to: '/students', label: 'Students' },
    { to: '/fees', label: 'Fees' },
];
export const Sidebar = () => (_jsxs("aside", { className: "mono-sidebar", children: [_jsxs("div", { children: [_jsx("p", { className: "mono-sidebar__brand", children: "Hostelia" }), _jsx("p", { className: "mono-sidebar__title", children: "Control Center" })] }), _jsx("nav", { className: "mono-sidebar__nav", children: links.map((link) => (_jsx(NavLink, { to: link.to, className: ({ isActive }) => ['mono-nav-link', isActive ? 'is-active' : ''].join(' ').trim(), children: link.label }, link.to))) }), _jsx("p", { className: "mono-sidebar__footer", children: "Operate, release, and monitor." })] }));
