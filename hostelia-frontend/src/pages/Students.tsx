import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppShell } from '../components/layout/AppShell';
import { useHostels } from '../hooks/useHostels';
import { HostelSelector } from '../components/HostelSelector';
import api from '../api/client';
import { Room, Student } from '../types';
import { DataTable } from '../components/common/DataTable';

const StudentsPage = () => {
  const { hostels } = useHostels();
  const [selectedHostel, setSelectedHostel] = useState<string>();
  const [students, setStudents] = useState<Student[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const form = useForm({ defaultValues: { monthlyFee: 0 } });

  useEffect(() => {
    if (hostels.length && !selectedHostel) {
      setSelectedHostel(hostels[0].id);
    }
  }, [hostels, selectedHostel]);

  const fetchData = async (hostelId: string) => {
    const [studentsRes, roomsRes] = await Promise.all([
      api.get<Student[]>(`/hostels/${hostelId}/students`),
      api.get<Room[]>(`/hostels/${hostelId}/rooms`),
    ]);
    setStudents(studentsRes.data);
    setRooms(roomsRes.data);
  };

  useEffect(() => {
    if (selectedHostel) {
      fetchData(selectedHostel);
    }
  }, [selectedHostel]);

  const onCreate = async (values: any) => {
    if (!selectedHostel) return;
    await api.post(`/hostels/${selectedHostel}/students`, {
      ...values,
      monthlyFee: Number(values.monthlyFee),
      roomId: values.roomId || undefined,
    });
    form.reset({ monthlyFee: 0 });
    fetchData(selectedHostel);
  };

  const remove = async (student: Student) => {
    if (!selectedHostel) return;
    if (!confirm('Remove student?')) return;
    await api.delete(`/hostels/${selectedHostel}/students/${student.id}`);
    fetchData(selectedHostel);
  };

  const roomOptions = useMemo(() => rooms.map((room) => ({ value: room.id, label: `${room.roomNumber} (${room.students.length}/${room.capacity})` })), [rooms]);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Students</h1>
            <p className="text-sm text-slate-500">Assign learners to rooms and track dues.</p>
          </div>
          {hostels.length > 0 && selectedHostel && (
            <HostelSelector hostels={hostels} value={selectedHostel} onChange={setSelectedHostel} />
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-4">
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
                {
                  key: 'id',
                  label: 'Actions',
                  render: (student) => (
                    <button className="text-sm text-red-500" onClick={() => remove(student)}>
                      Remove
                    </button>
                  ),
                },
              ]}
              empty="No students yet"
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-xl font-semibold">Add student</h2>
            <form className="mt-4 space-y-3" onSubmit={form.handleSubmit(onCreate)}>
              <div>
                <label className="text-sm font-medium">Name</label>
                <input {...form.register('name', { required: true })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
              </div>
              <div>
                <label className="text-sm font-medium">Roll number</label>
                <input {...form.register('rollNumber', { required: true })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input type="email" {...form.register('email')} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <input {...form.register('phone')} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
              </div>
              <div>
                <label className="text-sm font-medium">Monthly fee</label>
                <input
                  type="number"
                  step="0.01"
                  {...form.register('monthlyFee', { required: true, valueAsNumber: true })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Room (optional)</label>
                <select {...form.register('roomId')} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
                  <option value="">Unassigned</option>
                  {roomOptions.map((room) => (
                    <option key={room.value} value={room.value}>
                      {room.label}
                    </option>
                  ))}
                </select>
              </div>
              <button className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white" type="submit">
                Save student
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default StudentsPage;
