import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const Footer = () => {
    const year = new Date().getFullYear();
    return (_jsxs("footer", { className: "mono-footer", children: [_jsx("span", { className: "mono-footer__brand", children: "Hostelia" }), _jsx("span", { className: "mono-footer__meta", children: `Copyright ${year} - Control Center` })] }));
};
