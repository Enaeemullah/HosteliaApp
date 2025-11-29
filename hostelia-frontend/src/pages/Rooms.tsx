import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppShell } from '../components/layout/AppShell';
import { useHostels } from '../hooks/useHostels';
import { HostelSelector } from '../components/HostelSelector';
import api from '../api/client';
import { Room } from '../types';

const RoomsPage = () => {
  const { hostels } = useHostels();
  const [selectedHostel, setSelectedHostel] = useState<string>();
  const [rooms, setRooms] = useState<Room[]>([]);
  const form = useForm<{ roomNumber: string; capacity: number }>();

  useEffect(() => {
    if (hostels.length && !selectedHostel) {
      setSelectedHostel(hostels[0].id);
    }
  }, [hostels, selectedHostel]);

  const fetchRooms = async (hostelId: string) => {
    const { data } = await api.get<Room[]>(`/hostels/${hostelId}/rooms`);
    setRooms(data);
  };

  useEffect(() => {
    if (selectedHostel) {
      fetchRooms(selectedHostel);
    }
  }, [selectedHostel]);

  const onCreate = async (values: { roomNumber: string; capacity: number }) => {
    if (!selectedHostel) return;
    await api.post(`/hostels/${selectedHostel}/rooms`, {
      ...values,
      capacity: Number(values.capacity),
    });
    form.reset();
    fetchRooms(selectedHostel);
  };

  const remove = async (room: Room) => {
    if (!selectedHostel) return;
    if (!confirm('Delete room?')) return;
    await api.delete(`/hostels/${selectedHostel}/rooms/${room.id}`);
    fetchRooms(selectedHostel);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Rooms</h1>
            <p className="text-sm text-slate-500">Track capacity and occupancy per hostel.</p>
          </div>
          {hostels.length > 0 && selectedHostel && (
            <HostelSelector hostels={hostels} value={selectedHostel} onChange={setSelectedHostel} />
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="grid gap-4 md:grid-cols-2">
            {rooms.map((room) => (
              <div key={room.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Room</p>
                    <p className="text-2xl font-semibold">{room.roomNumber}</p>
                  </div>
                  <button className="text-sm text-red-500" onClick={() => remove(room)}>
                    Delete
                  </button>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  Capacity {room.capacity} • Occupied {room.students?.length ?? 0}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {room.students?.map((student) => (
                    <span key={student.id} className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                      {student.name}
                    </span>
                  ))}
                  {!room.students?.length && <span className="text-xs text-slate-400">Vacant</span>}
                </div>
              </div>
            ))}
            {!rooms.length && <p className="text-sm text-slate-500">No rooms for this hostel yet.</p>}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-xl font-semibold">Add room</h2>
            <form className="mt-4 space-y-3" onSubmit={form.handleSubmit(onCreate)}>
              <div>
                <label className="text-sm font-medium">Room number</label>
                <input
                  {...form.register('roomNumber', { required: true })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Capacity</label>
                <input
                  type="number"
                  min={1}
                  {...form.register('capacity', { required: true, valueAsNumber: true })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
              <button className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white" type="submit">
                Save room
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default RoomsPage;
