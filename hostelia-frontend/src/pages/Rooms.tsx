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
      <div className="mono-stack">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="mono-label">Inventory</p>
            <h1 className="mono-title">Rooms</h1>
            <p className="mono-subtitle">Track capacity and occupancy per hostel.</p>
          </div>
          {hostels.length > 0 && selectedHostel && (
            <HostelSelector hostels={hostels} value={selectedHostel} onChange={setSelectedHostel} />
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="grid gap-4 md:grid-cols-2">
            {rooms.map((room) => (
              <div key={room.id} className="mono-panel mono-stack mono-stack--tight">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mono-label">Room</p>
                    <p className="mono-metric__value" style={{ fontSize: '1.8rem' }}>
                      {room.roomNumber}
                    </p>
                  </div>
                  <button className="mono-text-button mono-text-button--danger" onClick={() => remove(room)}>
                    Delete
                  </button>
                </div>
                <p className="mono-note">
                  Capacity {room.capacity} • Occupied {room.students?.length ?? 0}
                </p>
                <div className="flex flex-wrap gap-2">
                  {room.students?.map((student) => (
                    <span key={student.id} className="mono-chip">
                      {student.name}
                    </span>
                  ))}
                  {!room.students?.length && <span className="mono-note">Vacant</span>}
                </div>
              </div>
            ))}
            {!rooms.length && <div className="mono-empty">No rooms for this hostel yet.</div>}
          </div>

          <div className="mono-panel mono-stack">
            <div>
              <p className="mono-label">Create</p>
              <h2 className="mono-title" style={{ fontSize: '1.4rem' }}>
                Add room
              </h2>
            </div>
            <form className="mono-stack mono-stack--tight" onSubmit={form.handleSubmit(onCreate)}>
              <div className="mono-field">
                <label className="mono-label">Room number</label>
                <input {...form.register('roomNumber', { required: true })} className="mono-input" />
              </div>
              <div className="mono-field">
                <label className="mono-label">Capacity</label>
                <input
                  type="number"
                  min={1}
                  {...form.register('capacity', { required: true, valueAsNumber: true })}
                  className="mono-input"
                />
              </div>
              <button className="mono-button mono-button--solid" type="submit">
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
