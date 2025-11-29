import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const MetricCard = ({ label, value, helper }) => (_jsxs("div", { className: "mono-panel", children: [_jsx("p", { className: "mono-label", children: label }), _jsx("p", { className: "mono-metric__value", children: value }), helper && _jsx("p", { className: "mono-note", children: helper })] }));
