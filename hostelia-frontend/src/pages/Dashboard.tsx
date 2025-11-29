import { useEffect, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { useHostels } from '../hooks/useHostels';
import api from '../api/client';
import { DashboardSummary, Student } from '../types';
import { HostelSelector } from '../components/HostelSelector';
import { MetricCard } from '../components/common/MetricCard';
import { DataTable } from '../components/common/DataTable';
import { ReportButtons } from '../components/ReportButtons';

const Dashboard = () => {
  const { hostels, loading } = useHostels();
  const [selectedHostel, setSelectedHostel] = useState<string>();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    if (!loading && hostels.length && !selectedHostel) {
      setSelectedHostel(hostels[0].id);
    }
  }, [hostels, loading, selectedHostel]);

  useEffect(() => {
    if (!selectedHostel) return;
    const fetchData = async () => {
      const [dashboardRes, studentsRes] = await Promise.all([
        api.get<DashboardSummary>(`/hostels/${selectedHostel}/dashboard`),
        api.get<Student[]>(`/hostels/${selectedHostel}/students`),
      ]);
      setSummary(dashboardRes.data);
      setStudents(studentsRes.data);
    };
    fetchData();
  }, [selectedHostel]);

  if (!hostels.length && !loading) {
    return (
      <AppShell>
        <div className="rounded-lg bg-white p-6 shadow">Create your first hostel to view the dashboard.</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-sm text-slate-500">Track occupancy, students, and fees for each hostel.</p>
          </div>
          {hostels.length > 0 && selectedHostel && (
            <HostelSelector hostels={hostels} value={selectedHostel} onChange={setSelectedHostel} />
          )}
        </div>

        {summary && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Total Students" value={summary.totalStudents} />
            <MetricCard label="Total Rooms" value={summary.totalRooms} helper={`${summary.occupiedRooms} occupied`} />
            <MetricCard label="Pending Fees" value={summary.pendingFees} helper={`$${summary.pendingAmount.toFixed(2)}`} />
            <MetricCard label="Vacant Rooms" value={summary.vacantRooms} helper="Ready for allocation" />
          </div>
        )}

        {summary && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-xl font-semibold">Students per room</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {Object.entries(summary.studentsPerRoom).map(([room, count]) => (
                <div key={room} className="rounded-lg border border-slate-100 p-3">
                  <p className="text-sm text-slate-500">Room {room}</p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
              ))}
              {!Object.keys(summary.studentsPerRoom).length && <p className="text-sm text-slate-500">Assign students to rooms to see usage.</p>}
            </div>
          </div>
        )}

        {selectedHostel && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Fee reports</h2>
                <p className="text-sm text-slate-500">Export CSV, Excel, or PDF summaries.</p>
              </div>
              <ReportButtons hostelId={selectedHostel} />
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Students</h2>
          <DataTable
            data={students}
            columns={[
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
            ]}
            empty="No students yet"
          />
        </div>
      </div>
    </AppShell>
  );
};

export default Dashboard;
