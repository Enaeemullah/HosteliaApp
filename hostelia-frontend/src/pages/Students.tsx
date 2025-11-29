import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppShell } from '../components/layout/AppShell';
import { useHostels } from '../hooks/useHostels';
import { HostelSelector } from '../components/HostelSelector';
import api from '../api/client';
import { Room, Student } from '../types';
import { DataTable } from '../components/common/DataTable';
import { formatCurrency } from '../utils/formatCurrency';

type StudentFormValues = {
  name: string;
  rollNumber: string;
  email?: string;
  phone?: string;
  monthlyFee: number;
  roomId?: string;
};

const StudentsPage = () => {
  const { hostels } = useHostels();
  const [selectedHostel, setSelectedHostel] = useState<string>();
  const [students, setStudents] = useState<Student[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const form = useForm<StudentFormValues>({ defaultValues: { monthlyFee: 0 } });

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

  const onCreate = async (values: StudentFormValues) => {
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
      <div className="mono-stack">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="mono-label">Roster</p>
            <h1 className="mono-title">Students</h1>
            <p className="mono-subtitle">Assign learners to rooms and track dues.</p>
          </div>
          {hostels.length > 0 && selectedHostel && (
            <HostelSelector hostels={hostels} value={selectedHostel} onChange={setSelectedHostel} />
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="mono-panel mono-stack">
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
                {
                  key: 'id',
                  label: 'Actions',
                  render: (student) => (
                    <button className="mono-text-button mono-text-button--danger" onClick={() => remove(student)}>
                      Remove
                    </button>
                  ),
                },
              ]}
              empty="No students yet"
            />
          </div>

          <div className="mono-panel mono-stack">
            <div>
              <p className="mono-label">Create</p>
              <h2 className="mono-title" style={{ fontSize: '1.4rem' }}>
                Add student
              </h2>
            </div>
            <form className="mono-stack mono-stack--tight" onSubmit={form.handleSubmit(onCreate)}>
              <div className="mono-field">
                <label className="mono-label">Name</label>
                <input {...form.register('name', { required: true })} className="mono-input" />
              </div>
              <div className="mono-field">
                <label className="mono-label">Roll number</label>
                <input {...form.register('rollNumber', { required: true })} className="mono-input" />
              </div>
              <div className="mono-field">
                <label className="mono-label">Email</label>
                <input type="email" {...form.register('email')} className="mono-input" />
              </div>
              <div className="mono-field">
                <label className="mono-label">Phone</label>
                <input {...form.register('phone')} className="mono-input" />
              </div>
              <div className="mono-field">
                <label className="mono-label">Monthly fee</label>
                <input
                  type="number"
                  step="0.01"
                  {...form.register('monthlyFee', { required: true, valueAsNumber: true })}
                  className="mono-input"
                />
              </div>
              <div className="mono-field">
                <label className="mono-label">Room (optional)</label>
                <select {...form.register('roomId')} className="mono-select">
                  <option value="">Unassigned</option>
                  {roomOptions.map((room) => (
                    <option key={room.value} value={room.value}>
                      {room.label}
                    </option>
                  ))}
                </select>
              </div>
              <button className="mono-button mono-button--solid" type="submit">
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
