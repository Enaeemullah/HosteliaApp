import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppShell } from '../components/layout/AppShell';
import { useHostels } from '../hooks/useHostels';
import { HostelSelector } from '../components/HostelSelector';
import api from '../api/client';
import { Fee, Student, Receipt } from '../types';
import { DataTable } from '../components/common/DataTable';
import { formatCurrency } from '../utils/formatCurrency';

const FeePage = () => {
  const { hostels } = useHostels();
  const [selectedHostel, setSelectedHostel] = useState<string>();
  const [fees, setFees] = useState<Fee[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [receipt, setReceipt] = useState<{ feeId: string; data: Receipt } | null>(null);
  const form = useForm<{ studentId: string; amount: number; dueDate: string }>();
  const selectedStudentId = form.watch('studentId');

  useEffect(() => {
    if (hostels.length && !selectedHostel) {
      setSelectedHostel(hostels[0].id);
    }
  }, [hostels, selectedHostel]);

  const fetchData = async (hostelId: string) => {
    const [feesRes, studentsRes] = await Promise.all([
      api.get<Fee[]>(`/hostels/${hostelId}/fees`),
      api.get<Student[]>(`/hostels/${hostelId}/students`),
    ]);
    setFees(feesRes.data);
    setStudents(studentsRes.data);
  };

  useEffect(() => {
    if (selectedHostel) {
      fetchData(selectedHostel);
    }
  }, [selectedHostel]);

  useEffect(() => {
    setReceipt(null);
  }, [selectedHostel]);

  const onCreate = async (values: { studentId: string; amount: number; dueDate: string }) => {
    if (!selectedHostel) return;
    await api.post(`/hostels/${selectedHostel}/students/${values.studentId}/fees`, {
      amount: Number(values.amount),
      dueDate: values.dueDate,
      status: 'pending',
    });
    form.reset();
    fetchData(selectedHostel);
  };

  const fetchReceipt = async (feeId: string) => {
    if (!selectedHostel) return null;
    const { data } = await api.get<Receipt>(`/hostels/${selectedHostel}/fees/${feeId}/receipt`);
    return data;
  };

  const showReceipt = async (feeId: string) => {
    const data = await fetchReceipt(feeId);
    if (data) {
      setReceipt({ feeId, data });
    }
  };

  const updateStatus = async (fee: Fee, status: 'paid' | 'pending' | 'overdue') => {
    if (!selectedHostel) return;
    await api.patch(`/hostels/${selectedHostel}/fees/${fee.id}`, { status });
    await fetchData(selectedHostel);
    if (status === 'paid') {
      try {
        await showReceipt(fee.id);
      } catch {
        // Receipt endpoint might still be propagating; allow manual retry.
      }
    } else if (receipt?.feeId === fee.id) {
      setReceipt(null);
    }
  };

  const viewReceipt = async (fee: Fee) => {
    await showReceipt(fee.id);
  };

  return (
    <AppShell>
      <div className="mono-stack">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="mono-label">Billing</p>
            <h1 className="mono-title">Fees</h1>
            <p className="mono-subtitle">Bill students monthly and log receipts.</p>
          </div>
          {hostels.length > 0 && selectedHostel && (
            <HostelSelector hostels={hostels} value={selectedHostel} onChange={setSelectedHostel} />
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="mono-panel mono-stack">
            <DataTable
              data={fees}
              columns={[
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
                  render: (fee) => (
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="flex gap-2">
                        <button className="mono-text-button" onClick={() => updateStatus(fee, 'paid')}>
                          Mark paid
                        </button>
                        <button className="mono-text-button" onClick={() => updateStatus(fee, 'pending')}>
                          Pending
                        </button>
                      </div>
                      {fee.status === 'paid' && (
                        <button className="mono-text-button" onClick={() => viewReceipt(fee)}>
                          View receipt
                        </button>
                      )}
                    </div>
                  ),
                },
              ]}
              empty="No fees yet"
            />
          </div>

          <div className="mono-stack">
            <div className="mono-panel mono-stack">
              <div>
                <p className="mono-label">Create</p>
                <h2 className="mono-title" style={{ fontSize: '1.4rem' }}>
                  Assign monthly fee
                </h2>
              </div>
              <form className="mono-stack mono-stack--tight" onSubmit={form.handleSubmit(onCreate)}>
                <div className="mono-field">
                  <label className="mono-label">Student</label>
                  <select {...form.register('studentId', { required: true })} className="mono-select">
                    <option value="">Select student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mono-field">
                  <label className="mono-label">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    {...form.register('amount', { required: true, valueAsNumber: true })}
                    className="mono-input"
                  />
                </div>
                <div className="mono-field">
                  <label className="mono-label">Due date</label>
                  <input type="date" {...form.register('dueDate', { required: true })} className="mono-input" />
                </div>
                <button className="mono-button mono-button--solid" type="submit">
                  Assign fee
                </button>
              </form>
              <div className="mono-stack mono-stack--tight">
                <div>
                  <p className="mono-label">Students</p>
                  <p className="mono-subtitle" style={{ marginTop: 0 }}>
                    Use the quick list to populate the selector above.
                  </p>
                </div>
                {students.length ? (
                  <ul className="mono-roster-list">
                    {students.map((student) => (
                      <li
                        key={student.id}
                        className={['mono-roster-list__item', selectedStudentId === student.id ? 'is-active' : '']
                          .join(' ')
                          .trim()}
                      >
                        <div>
                          <p className="mono-roster-list__name">{student.name}</p>
                          <p className="mono-roster-list__meta">
                            {student.rollNumber} - {formatCurrency(student.monthlyFee)}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="mono-text-button"
                          onClick={() => form.setValue('studentId', student.id)}
                        >
                          Use
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mono-empty">No students yet</div>
                )}
              </div>
            </div>

            {receipt && (
              <div className="mono-panel mono-stack">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mono-label">Receipt</p>
                    <h2 className="mono-title" style={{ fontSize: '1.4rem' }}>
                      {receipt.data.reference}
                    </h2>
                  </div>
                  <button className="mono-text-button" onClick={() => setReceipt(null)}>
                    Close
                  </button>
                </div>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="mono-label" style={{ marginBottom: 0 }}>
                      Paid on
                    </dt>
                    <dd>{new Date(receipt.data.paidOn).toLocaleDateString()}</dd>
                  </div>
                  {receipt.data.notes && (
                    <div className="flex justify-between">
                      <dt className="mono-label" style={{ marginBottom: 0 }}>
                        Notes
                      </dt>
                      <dd>{receipt.data.notes}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default FeePage;
