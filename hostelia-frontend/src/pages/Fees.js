import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppShell } from '../components/layout/AppShell';
import { useHostels } from '../hooks/useHostels';
import { HostelSelector } from '../components/HostelSelector';
import api from '../api/client';
import { DataTable } from '../components/common/DataTable';
const FeePage = () => {
    const { hostels } = useHostels();
    const [selectedHostel, setSelectedHostel] = useState();
    const [fees, setFees] = useState([]);
    const [students, setStudents] = useState([]);
    const [receipt, setReceipt] = useState(null);
    const form = useForm();
    useEffect(() => {
        if (hostels.length && !selectedHostel) {
            setSelectedHostel(hostels[0].id);
        }
    }, [hostels, selectedHostel]);
    const fetchData = async (hostelId) => {
        const [feesRes, studentsRes] = await Promise.all([
            api.get(`/hostels/${hostelId}/fees`),
            api.get(`/hostels/${hostelId}/students`),
        ]);
        setFees(feesRes.data);
        setStudents(studentsRes.data);
    };
    useEffect(() => {
        if (selectedHostel) {
            fetchData(selectedHostel);
        }
    }, [selectedHostel]);
    const onCreate = async (values) => {
        if (!selectedHostel)
            return;
        await api.post(`/hostels/${selectedHostel}/students/${values.studentId}/fees`, {
            amount: Number(values.amount),
            dueDate: values.dueDate,
            status: 'pending',
        });
        form.reset();
        fetchData(selectedHostel);
    };
    const updateStatus = async (fee, status) => {
        if (!selectedHostel)
            return;
        await api.patch(`/hostels/${selectedHostel}/fees/${fee.id}`, { status });
        fetchData(selectedHostel);
    };
    const viewReceipt = async (fee) => {
        if (!selectedHostel)
            return;
        const { data } = await api.get(`/hostels/${selectedHostel}/fees/${fee.id}/receipt`);
        setReceipt(data);
    };
    return (_jsx(AppShell, { children: _jsxs("div", { className: "mono-stack", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-6", children: [_jsxs("div", { children: [_jsx("p", { className: "mono-label", children: "Billing" }), _jsx("h1", { className: "mono-title", children: "Fees" }), _jsx("p", { className: "mono-subtitle", children: "Bill students monthly and log receipts." })] }), hostels.length > 0 && selectedHostel && (_jsx(HostelSelector, { hostels: hostels, value: selectedHostel, onChange: setSelectedHostel }))] }), _jsxs("div", { className: "grid gap-6 lg:grid-cols-[2fr,1fr]", children: [_jsx("div", { className: "mono-panel mono-stack", children: _jsx(DataTable, { data: fees, columns: [
                                    {
                                        key: 'student',
                                        label: 'Student',
                                        render: (fee) => `${fee.student.name} (${fee.student.rollNumber})`,
                                    },
                                    { key: 'amount', label: 'Amount', render: (fee) => `$${fee.amount}` },
                                    { key: 'dueDate', label: 'Due Date' },
                                    { key: 'status', label: 'Status' },
                                    {
                                        key: 'id',
                                        label: 'Actions',
                                        render: (fee) => (_jsxs("div", { className: "flex flex-col gap-1 text-xs", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { className: "mono-text-button", onClick: () => updateStatus(fee, 'paid'), children: "Mark paid" }), _jsx("button", { className: "mono-text-button", onClick: () => updateStatus(fee, 'pending'), children: "Pending" })] }), fee.status === 'paid' && (_jsx("button", { className: "mono-text-button", onClick: () => viewReceipt(fee), children: "View receipt" }))] })),
                                    },
                                ], empty: "No fees yet" }) }), _jsxs("div", { className: "mono-stack", children: [_jsxs("div", { className: "mono-panel mono-stack", children: [_jsxs("div", { children: [_jsx("p", { className: "mono-label", children: "Create" }), _jsx("h2", { className: "mono-title", style: { fontSize: '1.4rem' }, children: "Assign monthly fee" })] }), _jsxs("form", { className: "mono-stack mono-stack--tight", onSubmit: form.handleSubmit(onCreate), children: [_jsxs("div", { className: "mono-field", children: [_jsx("label", { className: "mono-label", children: "Student" }), _jsxs("select", { ...form.register('studentId', { required: true }), className: "mono-select", children: [_jsx("option", { value: "", children: "Select student" }), students.map((student) => (_jsx("option", { value: student.id, children: student.name }, student.id)))] })] }), _jsxs("div", { className: "mono-field", children: [_jsx("label", { className: "mono-label", children: "Amount" }), _jsx("input", { type: "number", step: "0.01", ...form.register('amount', { required: true, valueAsNumber: true }), className: "mono-input" })] }), _jsxs("div", { className: "mono-field", children: [_jsx("label", { className: "mono-label", children: "Due date" }), _jsx("input", { type: "date", ...form.register('dueDate', { required: true }), className: "mono-input" })] }), _jsx("button", { className: "mono-button mono-button--solid", type: "submit", children: "Assign fee" })] })] }), receipt && (_jsxs("div", { className: "mono-panel mono-stack", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "mono-label", children: "Receipt" }), _jsx("h2", { className: "mono-title", style: { fontSize: '1.4rem' }, children: receipt.reference })] }), _jsx("button", { className: "mono-text-button", onClick: () => setReceipt(null), children: "Close" })] }), _jsxs("dl", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "mono-label", style: { marginBottom: 0 }, children: "Paid on" }), _jsx("dd", { children: new Date(receipt.paidOn).toLocaleDateString() })] }), receipt.notes && (_jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "mono-label", style: { marginBottom: 0 }, children: "Notes" }), _jsx("dd", { children: receipt.notes })] }))] })] }))] })] })] }) }));
};
export default FeePage;
