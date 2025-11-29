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

  const normalizePayload = (values: Omit<Hostel, 'id'>) => ({
    ...values,
    name: values.name.trim(),
    address: values.address.trim(),
    description: values.description?.trim() || undefined,
    phone: values.phone?.trim() || undefined,
    logoUrl: values.logoUrl?.trim() || undefined,
  });

  const onCreate = async (values: Omit<Hostel, 'id'>) => {
    await api.post('/hostels', normalizePayload(values));
    createForm.reset();
    refetch();
  };

  const startEdit = (hostel: Hostel) => {
    setEditing(hostel);
    editForm.reset({
      name: hostel.name,
      address: hostel.address,
      description: hostel.description,
      phone: hostel.phone,
      logoUrl: hostel.logoUrl,
    });
  };

  const onEdit = async (values: Omit<Hostel, 'id'>) => {
    if (!editing) return;
    await api.patch(`/hostels/${editing.id}`, normalizePayload(values));
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
        <div className="mono-stack">
          <div>
            <p className="mono-label">Inventory</p>
            <h1 className="mono-title">Hostels</h1>
            <p className="mono-subtitle">Manage all the properties linked to your account.</p>
          </div>

          <div className="mono-stack">
            {loading && <p className="mono-note">Loading...</p>}
            {hostels.map((hostel) => (
              <div key={hostel.id} className="mono-panel mono-stack mono-stack--tight">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="mono-label">Property</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>{hostel.name}</p>
                    <p className="mono-note">{hostel.address}</p>
                    {hostel.phone && (
                      <p className="mono-note" style={{ marginTop: 4 }}>
                        Phone: {hostel.phone}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button className="mono-text-button" onClick={() => startEdit(hostel)}>
                      Edit
                    </button>
                    <button className="mono-text-button mono-text-button--danger" onClick={() => onDelete(hostel)}>
                      Delete
                    </button>
                  </div>
                </div>
                {hostel.description && <p className="mono-subtitle">{hostel.description}</p>}
              </div>
            ))}
            {!loading && !hostels.length && <div className="mono-empty">No hostels yet.</div>}
          </div>
        </div>

        <div className="mono-stack">
          <div className="mono-panel mono-stack">
            <div>
              <p className="mono-label">Create</p>
              <h2 className="mono-title" style={{ fontSize: '1.4rem' }}>
                Add hostel
              </h2>
            </div>
            <form className="mono-stack mono-stack--tight" onSubmit={createForm.handleSubmit(onCreate)}>
              <div className="mono-field">
                <label className="mono-label">Name</label>
                <input {...createForm.register('name', { required: true })} className="mono-input" />
              </div>
              <div className="mono-field">
                <label className="mono-label">Address</label>
                <input {...createForm.register('address', { required: true })} className="mono-input" />
              </div>
              <div className="mono-field">
                <label className="mono-label">Description</label>
                <textarea {...createForm.register('description')} className="mono-textarea" rows={3} />
              </div>
              <div className="mono-field">
                <label className="mono-label">Phone</label>
                <input {...createForm.register('phone')} className="mono-input" placeholder="+1 555-0100" />
              </div>
              <div className="mono-field">
                <label className="mono-label">Logo URL</label>
                <input
                  {...createForm.register('logoUrl')}
                  className="mono-input"
                  placeholder="https://example.com/logo.png"
                />
                <p className="mono-note">Paste a publicly hosted image link (PNG, JPG, or SVG).</p>
              </div>
              <button className="mono-button mono-button--solid" type="submit">
                Save hostel
              </button>
            </form>
          </div>

          {editing && (
            <div className="mono-panel mono-stack">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mono-label">Editing</p>
                  <h2 className="mono-title" style={{ fontSize: '1.4rem' }}>
                    {editing.name}
                  </h2>
                </div>
                <button className="mono-text-button" onClick={() => setEditing(null)}>
                  Cancel
                </button>
              </div>
              <form className="mono-stack mono-stack--tight" onSubmit={editForm.handleSubmit(onEdit)}>
                <div className="mono-field">
                  <label className="mono-label">Name</label>
                  <input {...editForm.register('name', { required: true })} className="mono-input" />
                </div>
                <div className="mono-field">
                  <label className="mono-label">Address</label>
                  <input {...editForm.register('address', { required: true })} className="mono-input" />
                </div>
                <div className="mono-field">
                  <label className="mono-label">Description</label>
                  <textarea {...editForm.register('description')} className="mono-textarea" rows={3} />
                </div>
                <div className="mono-field">
                  <label className="mono-label">Phone</label>
                  <input {...editForm.register('phone')} className="mono-input" placeholder="+1 555-0100" />
                </div>
                <div className="mono-field">
                  <label className="mono-label">Logo URL</label>
                  <input
                    {...editForm.register('logoUrl')}
                    className="mono-input"
                    placeholder="https://example.com/logo.png"
                  />
                  <p className="mono-note">Refreshes the sidebar badge instantly.</p>
                </div>
                <button className="mono-button mono-button--solid" type="submit">
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
