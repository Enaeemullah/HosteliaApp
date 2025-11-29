import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function DataTable({ data, columns, empty }) {
    if (!data.length) {
        return _jsx("div", { className: "mono-empty", children: empty || 'No records yet.' });
    }
    return (_jsx("div", { className: "mono-table-wrapper", children: _jsxs("table", { className: "mono-table", children: [_jsx("thead", { children: _jsx("tr", { children: columns.map((col) => (_jsx("th", { children: col.label }, col.key))) }) }), _jsx("tbody", { children: data.map((row) => (_jsx("tr", { children: columns.map((col) => (_jsx("td", { children: col.render ? col.render(row) : row[col.key] }, col.key))) }, row.id ?? JSON.stringify(row)))) })] }) }));
}
