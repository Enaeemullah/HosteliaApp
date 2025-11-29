import { jsx as _jsx } from "react/jsx-runtime";
export const HostelSelector = ({ hostels, value, onChange }) => (_jsx("select", { value: value, onChange: (event) => onChange(event.target.value), className: "mono-select", children: hostels.map((hostel) => (_jsx("option", { value: hostel.id, children: hostel.name }, hostel.id))) }));
