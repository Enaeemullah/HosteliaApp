import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppShell } from '../components/layout/AppShell';
import { useHostels } from '../hooks/useHostels';
import api from '../api/client';
const HostelsPage = () => {
    const { hostels, loading, refetch } = useHostels();
    const createForm = useForm();
    const editForm = useForm();
    const [editing, setEditing] = useState(null);
    const onCreate = async (values) => {
        await api.post('/hostels', values);
        createForm.reset();
        refetch();
    };
    const startEdit = (hostel) => {
        setEditing(hostel);
        editForm.reset({ name: hostel.name, address: hostel.address, description: hostel.description });
    };
    const onEdit = async (values) => {
        if (!editing)
            return;
        await api.patch(`/hostels/${editing.id}`, values);
        setEditing(null);
        refetch();
    };
    const onDelete = async (hostel) => {
        if (!confirm(`Delete ${hostel.name}?`))
            return;
        await api.delete(`/hostels/${hostel.id}`);
        refetch();
    };
    return (_jsx(AppShell, { children: _jsxs("div", { className: "grid gap-6 lg:grid-cols-[2fr,1fr]", children: [_jsxs("div", { className: "mono-stack", children: [_jsxs("div", { children: [_jsx("p", { className: "mono-label", children: "Inventory" }), _jsx("h1", { className: "mono-title", children: "Hostels" }), _jsx("p", { className: "mono-subtitle", children: "Manage all the properties linked to your account." })] }), _jsxs("div", { className: "mono-stack", children: [loading && _jsx("p", { className: "mono-note", children: "Loading..." }), hostels.map((hostel) => (_jsxs("div", { className: "mono-panel mono-stack mono-stack--tight", children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "mono-label", children: "Property" }), _jsx("p", { style: { fontSize: '1.25rem', fontWeight: 600, margin: 0 }, children: hostel.name }), _jsx("p", { className: "mono-note", children: hostel.address })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { className: "mono-text-button", onClick: () => startEdit(hostel), children: "Edit" }), _jsx("button", { className: "mono-text-button mono-text-button--danger", onClick: () => onDelete(hostel), children: "Delete" })] })] }), hostel.description && _jsx("p", { className: "mono-subtitle", children: hostel.description })] }, hostel.id))), !loading && !hostels.length && _jsx("div", { className: "mono-empty", children: "No hostels yet." })] })] }), _jsxs("div", { className: "mono-stack", children: [_jsxs("div", { className: "mono-panel mono-stack", children: [_jsxs("div", { children: [_jsx("p", { className: "mono-label", children: "Create" }), _jsx("h2", { className: "mono-title", style: { fontSize: '1.4rem' }, children: "Add hostel" })] }), _jsxs("form", { className: "mono-stack mono-stack--tight", onSubmit: createForm.handleSubmit(onCreate), children: [_jsxs("div", { className: "mono-field", children: [_jsx("label", { className: "mono-label", children: "Name" }), _jsx("input", { ...createForm.register('name', { required: true }), className: "mono-input" })] }), _jsxs("div", { className: "mono-field", children: [_jsx("label", { className: "mono-label", children: "Address" }), _jsx("input", { ...createForm.register('address', { required: true }), className: "mono-input" })] }), _jsxs("div", { className: "mono-field", children: [_jsx("label", { className: "mono-label", children: "Description" }), _jsx("textarea", { ...createForm.register('description'), className: "mono-textarea", rows: 3 })] }), _jsx("button", { className: "mono-button mono-button--solid", type: "submit", children: "Save hostel" })] })] }), editing && (_jsxs("div", { className: "mono-panel mono-stack", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "mono-label", children: "Editing" }), _jsx("h2", { className: "mono-title", style: { fontSize: '1.4rem' }, children: editing.name })] }), _jsx("button", { className: "mono-text-button", onClick: () => setEditing(null), children: "Cancel" })] }), _jsxs("form", { className: "mono-stack mono-stack--tight", onSubmit: editForm.handleSubmit(onEdit), children: [_jsxs("div", { className: "mono-field", children: [_jsx("label", { className: "mono-label", children: "Name" }), _jsx("input", { ...editForm.register('name', { required: true }), className: "mono-input" })] }), _jsxs("div", { className: "mono-field", children: [_jsx("label", { className: "mono-label", children: "Address" }), _jsx("input", { ...editForm.register('address', { required: true }), className: "mono-input" })] }), _jsxs("div", { className: "mono-field", children: [_jsx("label", { className: "mono-label", children: "Description" }), _jsx("textarea", { ...editForm.register('description'), className: "mono-textarea", rows: 3 })] }), _jsx("button", { className: "mono-button mono-button--solid", type: "submit", children: "Update hostel" })] })] }))] })] }) }));
};
export default HostelsPage;
