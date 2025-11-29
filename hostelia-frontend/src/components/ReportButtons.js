import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import api from '../api/client';
const formats = [
    { label: 'CSV', value: 'csv' },
    { label: 'Excel', value: 'excel' },
    { label: 'PDF', value: 'pdf' },
];
export const ReportButtons = ({ hostelId }) => {
    const download = async (format) => {
        const { data } = await api.get(`/hostels/${hostelId}/reports/${format}`);
        const blob = atob(data.data);
        const bytes = new Uint8Array(blob.length);
        for (let i = 0; i < blob.length; i += 1) {
            bytes[i] = blob.charCodeAt(i);
        }
        const url = window.URL.createObjectURL(new Blob([bytes], { type: data.mimeType }));
        const a = document.createElement('a');
        a.href = url;
        a.download = data.filename;
        a.click();
        window.URL.revokeObjectURL(url);
    };
    return (_jsx("div", { className: "flex flex-wrap gap-2", children: formats.map((format) => (_jsxs("button", { onClick: () => download(format.value), className: "mono-button", children: ["Export ", format.label] }, format.value))) }));
};
