import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
export const AppShell = ({ children }) => (_jsxs("div", { className: "mono-layout", children: [_jsx(Sidebar, {}), _jsxs("div", { className: "mono-main", children: [_jsx(Topbar, {}), _jsx("main", { className: "mono-content", children: children })] })] }));
