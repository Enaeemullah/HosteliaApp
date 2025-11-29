import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppShell } from '../components/layout/AppShell';
import { useHostels } from '../hooks/useHostels';
import { HostelSelector } from '../components/HostelSelector';
import api from '../api/client';
import { DataTable } from '../components/common/DataTable';
import { formatCurrency } from '../utils/formatCurrency';
const StudentsPage = () => {
    const { hostels } = useHostels();
    const [selectedHostel, setSelectedHostel] = useState();
    const [students, setStudents] = useState([]);
    const [rooms, setRooms] = useState([]);
    const form = useForm({ defaultValues: { monthlyFee: 0 } });
    useEffect(() => {
        if (hostels.length && !selectedHostel) {
            setSelectedHostel(hostels[0].id);
        }
    }, [hostels, selectedHostel]);
    const fetchData = async (hostelId) => {
        const [studentsRes, roomsRes] = await Promise.all([
            api.get(`/hostels/${hostelId}/students`),
            api.get(`/hostels/${hostelId}/rooms`),
        ]);
        setStudents(studentsRes.data);
        setRooms(roomsRes.data);
    };
    useEffect(() => {
        if (selectedHostel) {
            fetchData(selectedHostel);
        }
    }, [selectedHostel]);
    const onCreate = async (values) => {
        if (!selectedHostel)
            return;
        await api.post(`/hostels/${selectedHostel}/students`, {
            ...values,
            monthlyFee: Number(values.monthlyFee),
            roomId: values.roomId || undefined,
        });
        form.reset({ monthlyFee: 0 });
        fetchData(selectedHostel);
    };
    const remove = async (student) => {
        if (!selectedHostel)
            return;
        if (!confirm('Remove student?'))
            return;
        await api.delete(`/hostels/${selectedHostel}/students/${student.id}`);
        fetchData(selectedHostel);
    };
    const roomOptions = useMemo(() => rooms.map((room) => ({ value: room.id, label: `${room.roomNumber} (${room.students.length}/${room.capacity})` })), [rooms]);
    return (_jsx(AppShell, { children: _jsxs("div", { className: "mono-stack", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-6", children: [_jsxs("div", { children: [_jsx("p", { className: "mono-label", children: "Roster" }), _jsx("h1", { className: "mono-title", children: "Students" }), _jsx("p", { className: "mono-subtitle", children: "Assign learners to rooms and track dues." })] }), hostels.length > 0 && selectedHostel && (_jsx(HostelSelector, { hostels: hostels, value: selectedHostel, onChange: setSelectedHostel }))] }), _jsxs("div", { className: "grid gap-6 lg:grid-cols-[2fr,1fr]", children: [_jsx("div", { className: "mono-panel mono-stack", children: _jsx(DataTable, { data: students, columns: [
                                    { key: 'name', label: 'Name' },
                                    { key: 'rollNumber', label: 'Roll' },
                                    {
                                        key: 'room',
                                        label: 'Room',
                                        render: (student) => student.room?.roomNumber ?? 'Unassigned',
                                    },
                                    {
                                        key: 'monthlyFee',
                                        label: 'Monthly Fee',
                                        render: (student) => formatCurrency(student.monthlyFee),
                                    },
                                    {
                                        key: 'id',
                                        label: 'Actions',
                                        render: (student) => (_jsx("button", { className: "mono-text-button mono-text-button--danger", onClick: () => remove(student), children: "Remove" })),
                                    },
                                ], empty: "No students yet" }) }), _jsxs("div", { className: "mono-panel mono-stack", children: [_jsxs("div", { children: [_jsx("p", { className: "mono-label", children: "Create" }), _jsx("h2", { className: "mono-title", style: { fontSize: '1.4rem' }, children: "Add student" })] }), _jsxs("form", { className: "mono-stack mono-stack--tight", onSubmit: form.handleSubmit(onCreate), children: [_jsxs("div", { className: "mono-field", children: [_jsx("label", { className: "mono-label", children: "Name" }), _jsx("input", { ...form.register('name', { required: true }), className: "mono-input" })] }), _jsxs("div", { className: "mono-field", children: [_jsx("label", { className: "mono-label", children: "Roll number" }), _jsx("input", { ...form.register('rollNumber', { required: true }), className: "mono-input" })] }), _jsxs("div", { className: "mono-field", children: [_jsx("label", { className: "mono-label", children: "Email" }), _jsx("input", { type: "email", ...form.register('email'), className: "mono-input" })] }), _jsxs("div", { className: "mono-field", children: [_jsx("label", { className: "mono-label", children: "Phone" }), _jsx("input", { ...form.register('phone'), className: "mono-input" })] }), _jsxs("div", { className: "mono-field", children: [_jsx("label", { className: "mono-label", children: "Monthly fee" }), _jsx("input", { type: "number", step: "0.01", ...form.register('monthlyFee', { required: true, valueAsNumber: true }), className: "mono-input" })] }), _jsxs("div", { className: "mono-field", children: [_jsx("label", { className: "mono-label", children: "Room (optional)" }), _jsxs("select", { ...form.register('roomId'), className: "mono-select", children: [_jsx("option", { value: "", children: "Unassigned" }), roomOptions.map((room) => (_jsx("option", { value: room.value, children: room.label }, room.value)))] })] }), _jsx("button", { className: "mono-button mono-button--solid", type: "submit", children: "Save student" })] })] })] })] }) }));
};
export default StudentsPage;
