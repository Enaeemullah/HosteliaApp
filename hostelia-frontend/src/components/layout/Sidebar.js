import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from 'react-router-dom';
const makeIcon = (paths) => (_jsx("svg", { viewBox: "0 0 24 24", width: "20", height: "20", fill: "none", "aria-hidden": "true", focusable: "false", children: paths }));
const links = [
    {
        to: '/dashboard',
        label: 'Dashboard',
        icon: makeIcon(_jsxs(_Fragment, { children: [_jsx("rect", { x: "3", y: "3", width: "8", height: "8", rx: "1.4", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("rect", { x: "13", y: "3", width: "8", height: "5", rx: "1.4", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("rect", { x: "13", y: "10", width: "8", height: "11", rx: "1.4", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("rect", { x: "3", y: "13", width: "8", height: "8", rx: "1.4", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" })] })),
    },
    {
        to: '/hostels',
        label: 'Hostels',
        icon: makeIcon(_jsxs(_Fragment, { children: [_jsx("path", { d: "M5 21V9l7-5 7 5v12", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M9 21v-6h6v6", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M3 21h18", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" })] })),
    },
    {
        to: '/rooms',
        label: 'Rooms',
        icon: makeIcon(_jsxs(_Fragment, { children: [_jsx("path", { d: "M4 21V9", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M4 17h16", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("rect", { x: "8", y: "10", width: "6", height: "4", rx: "1", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M4 13h10a4 4 0 0 1 4 4v4", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" })] })),
    },
    {
        to: '/students',
        label: 'Students',
        icon: makeIcon(_jsxs(_Fragment, { children: [_jsx("circle", { cx: "12", cy: "8", r: "4", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M4 20c0-4 3.2-6 8-6s8 2 8 6", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" })] })),
    },
    {
        to: '/fees',
        label: 'Fees',
        icon: makeIcon(_jsxs(_Fragment, { children: [_jsx("path", { d: "M9 7h7a3 3 0 1 1 0 6h-5a3 3 0 1 0 0 6h7", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("line", { x1: "12", y1: "3", x2: "12", y2: "21", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" })] })),
    },
];
export const Sidebar = () => (_jsxs("aside", { className: "mono-sidebar", children: [_jsxs("div", { children: [_jsx("p", { className: "mono-sidebar__brand", children: "Hostelia" }), _jsx("p", { className: "mono-sidebar__title", children: "Control Center" })] }), _jsx("nav", { className: "mono-sidebar__nav", children: links.map((link) => (_jsxs(NavLink, { to: link.to, className: ({ isActive }) => ['mono-nav-link', isActive ? 'is-active' : ''].join(' ').trim(), children: [_jsx("span", { className: "mono-nav-link__icon", children: link.icon }), _jsx("span", { className: "mono-nav-link__label", children: link.label })] }, link.to))) }), _jsx("p", { className: "mono-sidebar__footer", children: "Operate, release, and monitor." })] }));
