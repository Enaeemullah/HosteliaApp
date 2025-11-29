import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '../../state/AuthContext';
export const Topbar = () => {
    const { user, signout } = useAuth();
    return (_jsxs("header", { className: "mono-topbar", children: [_jsxs("div", { children: [_jsx("p", { className: "mono-label", children: "Operator" }), _jsx("p", { className: "mono-topbar__user", children: user?.email ?? '—' })] }), _jsx("button", { onClick: signout, className: "mono-button mono-button--ghost", children: "Logout" })] }));
};
