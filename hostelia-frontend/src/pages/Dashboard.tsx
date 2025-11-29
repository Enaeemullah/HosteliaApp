import { useEffect, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { useHostels } from '../hooks/useHostels';
import api from '../api/client';
import { DashboardSummary, Student } from '../types';
import { HostelSelector } from '../components/HostelSelector';
import { MetricCard } from '../components/common/MetricCard';
import { DataTable } from '../components/common/DataTable';
import { ReportButtons } from '../components/ReportButtons';
import { formatCurrency } from '../utils/formatCurrency';

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
        <div className="mono-panel mono-stack">
          <p className="mono-label">Setup required</p>
          <h2 className="mono-title">Add your first hostel</h2>
          <p className="mono-subtitle">Create a hostel to unlock analytics, students, and fee tracking.</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mono-stack">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="mono-label">Overview</p>
            <h1 className="mono-title">Dashboard</h1>
            <p className="mono-subtitle">Track occupancy, students, and fees for every property.</p>
          </div>
          {hostels.length > 0 && selectedHostel && (
            <HostelSelector hostels={hostels} value={selectedHostel} onChange={setSelectedHostel} />
          )}
        </div>

        {summary && (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Total Students" value={summary.totalStudents} />
            <MetricCard label="Total Rooms" value={summary.totalRooms} helper={`${summary.occupiedRooms} occupied`} />
            <MetricCard label="Pending Fees" value={summary.pendingFees} helper={formatCurrency(summary.pendingAmount)} />
            <MetricCard label="Vacant Rooms" value={summary.vacantRooms} helper="Ready for allocation" />
          </div>
        )}

        {summary && (
          <div className="mono-panel space-y-4">
            <div>
              <p className="mono-label">Occupancy</p>
              <h2 className="mono-title" style={{ fontSize: '1.4rem' }}>
                Students per room
              </h2>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {Object.entries(summary.studentsPerRoom).map(([room, count]) => (
                <div key={room} className="border border-black p-3">
                  <p className="mono-label">Room {room}</p>
                  <p className="mono-metric__value" style={{ fontSize: '1.75rem' }}>
                    {count}
                  </p>
                </div>
              ))}
              {!Object.keys(summary.studentsPerRoom).length && <p className="mono-note">Assign students to rooms to see usage.</p>}
            </div>
          </div>
        )}

        {selectedHostel && (
          <div className="mono-panel">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="mono-label">Reports</p>
                <h2 className="mono-title" style={{ fontSize: '1.4rem' }}>
                  Fee exports
                </h2>
                <p className="mono-subtitle">Export CSV, Excel, or PDF summaries.</p>
              </div>
              <ReportButtons hostelId={selectedHostel} />
            </div>
          </div>
        )}

        <div className="mono-stack">
          <div>
            <p className="mono-label">Roster</p>
            <h2 className="mono-title" style={{ fontSize: '1.4rem' }}>
              Students
            </h2>
          </div>
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
                render: (student) => formatCurrency(student.monthlyFee),
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
