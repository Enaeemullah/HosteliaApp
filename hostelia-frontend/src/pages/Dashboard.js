import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { useHostels } from '../hooks/useHostels';
import api from '../api/client';
import { HostelSelector } from '../components/HostelSelector';
import { MetricCard } from '../components/common/MetricCard';
import { DataTable } from '../components/common/DataTable';
import { ReportButtons } from '../components/ReportButtons';
const Dashboard = () => {
    const { hostels, loading } = useHostels();
    const [selectedHostel, setSelectedHostel] = useState();
    const [summary, setSummary] = useState(null);
    const [students, setStudents] = useState([]);
    useEffect(() => {
        if (!loading && hostels.length && !selectedHostel) {
            setSelectedHostel(hostels[0].id);
        }
    }, [hostels, loading, selectedHostel]);
    useEffect(() => {
        if (!selectedHostel)
            return;
        const fetchData = async () => {
            const [dashboardRes, studentsRes] = await Promise.all([
                api.get(`/hostels/${selectedHostel}/dashboard`),
                api.get(`/hostels/${selectedHostel}/students`),
            ]);
            setSummary(dashboardRes.data);
            setStudents(studentsRes.data);
        };
        fetchData();
    }, [selectedHostel]);
    if (!hostels.length && !loading) {
        return (_jsx(AppShell, { children: _jsxs("div", { className: "mono-panel mono-stack", children: [_jsx("p", { className: "mono-label", children: "Setup required" }), _jsx("h2", { className: "mono-title", children: "Add your first hostel" }), _jsx("p", { className: "mono-subtitle", children: "Create a hostel to unlock analytics, students, and fee tracking." })] }) }));
    }
    return (_jsx(AppShell, { children: _jsxs("div", { className: "mono-stack", children: [_jsxs("div", { className: "flex flex-wrap items-start justify-between gap-6", children: [_jsxs("div", { children: [_jsx("p", { className: "mono-label", children: "Overview" }), _jsx("h1", { className: "mono-title", children: "Dashboard" }), _jsx("p", { className: "mono-subtitle", children: "Track occupancy, students, and fees for every property." })] }), hostels.length > 0 && selectedHostel && (_jsx(HostelSelector, { hostels: hostels, value: selectedHostel, onChange: setSelectedHostel }))] }), summary && (_jsxs("div", { className: "grid gap-3 md:grid-cols-2 lg:grid-cols-4", children: [_jsx(MetricCard, { label: "Total Students", value: summary.totalStudents }), _jsx(MetricCard, { label: "Total Rooms", value: summary.totalRooms, helper: `${summary.occupiedRooms} occupied` }), _jsx(MetricCard, { label: "Pending Fees", value: summary.pendingFees, helper: `$${summary.pendingAmount.toFixed(2)}` }), _jsx(MetricCard, { label: "Vacant Rooms", value: summary.vacantRooms, helper: "Ready for allocation" })] })), summary && (_jsxs("div", { className: "mono-panel space-y-4", children: [_jsxs("div", { children: [_jsx("p", { className: "mono-label", children: "Occupancy" }), _jsx("h2", { className: "mono-title", style: { fontSize: '1.4rem' }, children: "Students per room" })] }), _jsxs("div", { className: "grid gap-3 md:grid-cols-3", children: [Object.entries(summary.studentsPerRoom).map(([room, count]) => (_jsxs("div", { className: "border border-black p-3", children: [_jsxs("p", { className: "mono-label", children: ["Room ", room] }), _jsx("p", { className: "mono-metric__value", style: { fontSize: '1.75rem' }, children: count })] }, room))), !Object.keys(summary.studentsPerRoom).length && _jsx("p", { className: "mono-note", children: "Assign students to rooms to see usage." })] })] })), selectedHostel && (_jsx("div", { className: "mono-panel", children: _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "mono-label", children: "Reports" }), _jsx("h2", { className: "mono-title", style: { fontSize: '1.4rem' }, children: "Fee exports" }), _jsx("p", { className: "mono-subtitle", children: "Export CSV, Excel, or PDF summaries." })] }), _jsx(ReportButtons, { hostelId: selectedHostel })] }) })), _jsxs("div", { className: "mono-stack", children: [_jsxs("div", { children: [_jsx("p", { className: "mono-label", children: "Roster" }), _jsx("h2", { className: "mono-title", style: { fontSize: '1.4rem' }, children: "Students" })] }), _jsx(DataTable, { data: students, columns: [
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
                                    render: (student) => `$${student.monthlyFee.toFixed(2)}`,
                                },
                            ], empty: "No students yet" })] })] }) }));
};
export default Dashboard;
