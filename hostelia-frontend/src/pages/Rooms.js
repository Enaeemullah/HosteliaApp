import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppShell } from '../components/layout/AppShell';
import { useHostels } from '../hooks/useHostels';
import { HostelSelector } from '../components/HostelSelector';
import api from '../api/client';
const RoomsPage = () => {
    const { hostels } = useHostels();
    const [selectedHostel, setSelectedHostel] = useState();
    const [rooms, setRooms] = useState([]);
    const form = useForm();
    useEffect(() => {
        if (hostels.length && !selectedHostel) {
            setSelectedHostel(hostels[0].id);
        }
    }, [hostels, selectedHostel]);
    const fetchRooms = async (hostelId) => {
        const { data } = await api.get(`/hostels/${hostelId}/rooms`);
        setRooms(data);
    };
    useEffect(() => {
        if (selectedHostel) {
            fetchRooms(selectedHostel);
        }
    }, [selectedHostel]);
    const onCreate = async (values) => {
        if (!selectedHostel)
            return;
        await api.post(`/hostels/${selectedHostel}/rooms`, {
            ...values,
            capacity: Number(values.capacity),
        });
        form.reset();
        fetchRooms(selectedHostel);
    };
    const remove = async (room) => {
        if (!selectedHostel)
            return;
        if (!confirm('Delete room?'))
            return;
        await api.delete(`/hostels/${selectedHostel}/rooms/${room.id}`);
        fetchRooms(selectedHostel);
    };
    return (_jsx(AppShell, { children: _jsxs("div", { className: "mono-stack", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-6", children: [_jsxs("div", { children: [_jsx("p", { className: "mono-label", children: "Inventory" }), _jsx("h1", { className: "mono-title", children: "Rooms" }), _jsx("p", { className: "mono-subtitle", children: "Track capacity and occupancy per hostel." })] }), hostels.length > 0 && selectedHostel && (_jsx(HostelSelector, { hostels: hostels, value: selectedHostel, onChange: setSelectedHostel }))] }), _jsxs("div", { className: "grid gap-6 lg:grid-cols-[2fr,1fr]", children: [_jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [rooms.map((room) => (_jsxs("div", { className: "mono-panel mono-stack mono-stack--tight", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "mono-label", children: "Room" }), _jsx("p", { className: "mono-metric__value", style: { fontSize: '1.8rem' }, children: room.roomNumber })] }), _jsx("button", { className: "mono-text-button mono-text-button--danger", onClick: () => remove(room), children: "Delete" })] }), _jsxs("p", { className: "mono-note", children: ["Capacity ", room.capacity, " \u2022 Occupied ", room.students?.length ?? 0] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [room.students?.map((student) => (_jsx("span", { className: "mono-chip", children: student.name }, student.id))), !room.students?.length && _jsx("span", { className: "mono-note", children: "Vacant" })] })] }, room.id))), !rooms.length && _jsx("div", { className: "mono-empty", children: "No rooms for this hostel yet." })] }), _jsxs("div", { className: "mono-panel mono-stack", children: [_jsxs("div", { children: [_jsx("p", { className: "mono-label", children: "Create" }), _jsx("h2", { className: "mono-title", style: { fontSize: '1.4rem' }, children: "Add room" })] }), _jsxs("form", { className: "mono-stack mono-stack--tight", onSubmit: form.handleSubmit(onCreate), children: [_jsxs("div", { className: "mono-field", children: [_jsx("label", { className: "mono-label", children: "Room number" }), _jsx("input", { ...form.register('roomNumber', { required: true }), className: "mono-input" })] }), _jsxs("div", { className: "mono-field", children: [_jsx("label", { className: "mono-label", children: "Capacity" }), _jsx("input", { type: "number", min: 1, ...form.register('capacity', { required: true, valueAsNumber: true }), className: "mono-input" })] }), _jsx("button", { className: "mono-button mono-button--solid", type: "submit", children: "Save room" })] })] })] })] }) }));
};
export default RoomsPage;
