import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppShell } from '../components/layout/AppShell';
import { useHostels } from '../hooks/useHostels';
import api from '../api/client';
import { Hostel } from '../types';

const HostelsPage = () => {
  const { hostels, loading, refetch } = useHostels();
  const createForm = useForm<Omit<Hostel, 'id'>>();
  const editForm = useForm<Omit<Hostel, 'id'>>();
  const [editing, setEditing] = useState<Hostel | null>(null);

  const onCreate = async (values: Omit<Hostel, 'id'>) => {
    await api.post('/hostels', values);
    createForm.reset();
    refetch();
  };

  const startEdit = (hostel: Hostel) => {
    setEditing(hostel);
    editForm.reset({ name: hostel.name, address: hostel.address, description: hostel.description });
  };

  const onEdit = async (values: Omit<Hostel, 'id'>) => {
    if (!editing) return;
    await api.patch(`/hostels/${editing.id}`, values);
    setEditing(null);
    refetch();
  };

  const onDelete = async (hostel: Hostel) => {
    if (!confirm(`Delete ${hostel.name}?`)) return;
    await api.delete(`/hostels/${hostel.id}`);
    refetch();
  };

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Hostels</h1>
          <p className="text-sm text-slate-500">Manage all the properties linked to your account.</p>

          <div className="space-y-3">
            {loading && <p className="text-sm text-slate-500">Loading...</p>}
            {hostels.map((hostel) => (
              <div key={hostel.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold">{hostel.name}</p>
                    <p className="text-sm text-slate-500">{hostel.address}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-sm text-primary" onClick={() => startEdit(hostel)}>
                      Edit
                    </button>
                    <button className="text-sm text-red-500" onClick={() => onDelete(hostel)}>
                      Delete
                    </button>
                  </div>
                </div>
                {hostel.description && <p className="mt-2 text-sm text-slate-600">{hostel.description}</p>}
              </div>
            ))}
            {!loading && !hostels.length && <p className="text-sm text-slate-500">No hostels yet.</p>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-xl font-semibold">Add hostel</h2>
            <form className="mt-4 space-y-3" onSubmit={createForm.handleSubmit(onCreate)}>
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  {...createForm.register('name', { required: true })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Address</label>
                <input
                  {...createForm.register('address', { required: true })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  {...createForm.register('description')}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  rows={3}
                />
              </div>
              <button className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white" type="submit">
                Save hostel
              </button>
            </form>
          </div>

          {editing && (
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Edit {editing.name}</h2>
                <button className="text-sm text-slate-500" onClick={() => setEditing(null)}>
                  Cancel
                </button>
              </div>
              <form className="mt-4 space-y-3" onSubmit={editForm.handleSubmit(onEdit)}>
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <input {...editForm.register('name', { required: true })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
                </div>
                <div>
                  <label className="text-sm font-medium">Address</label>
                  <input
                    {...editForm.register('address', { required: true })}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <textarea {...editForm.register('description')} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" rows={3} />
                </div>
                <button className="w-full rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white" type="submit">
                  Update hostel
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
};

export default HostelsPage;
