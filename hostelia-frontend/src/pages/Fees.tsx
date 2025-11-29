import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppShell } from '../components/layout/AppShell';
import { useHostels } from '../hooks/useHostels';
import { HostelSelector } from '../components/HostelSelector';
import api from '../api/client';
import { Fee, Student, Receipt } from '../types';
import { DataTable } from '../components/common/DataTable';

const FeePage = () => {
  const { hostels } = useHostels();
  const [selectedHostel, setSelectedHostel] = useState<string>();
  const [fees, setFees] = useState<Fee[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const form = useForm<{ studentId: string; amount: number; dueDate: string }>();

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

  const updateStatus = async (fee: Fee, status: 'paid' | 'pending' | 'overdue') => {
    if (!selectedHostel) return;
    await api.patch(`/hostels/${selectedHostel}/fees/${fee.id}`, { status });
    fetchData(selectedHostel);
  };

  const viewReceipt = async (fee: Fee) => {
    if (!selectedHostel) return;
    const { data } = await api.get(`/hostels/${selectedHostel}/fees/${fee.id}/receipt`);
    setReceipt(data);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Fees</h1>
            <p className="text-sm text-slate-500">Bill students monthly and log receipts.</p>
          </div>
          {hostels.length > 0 && selectedHostel && (
            <HostelSelector hostels={hostels} value={selectedHostel} onChange={setSelectedHostel} />
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div>
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
                        <button className="text-green-600" onClick={() => updateStatus(fee, 'paid')}>
                          Mark paid
                        </button>
                        <button className="text-amber-600" onClick={() => updateStatus(fee, 'pending')}>
                          Pending
                        </button>
                      </div>
                      {fee.status === 'paid' && (
                        <button className="text-primary" onClick={() => viewReceipt(fee)}>
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

          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-xl font-semibold">Assign monthly fee</h2>
              <form className="mt-4 space-y-3" onSubmit={form.handleSubmit(onCreate)}>
                <div>
                  <label className="text-sm font-medium">Student</label>
                  <select {...form.register('studentId', { required: true })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
                    <option value="">Select student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    {...form.register('amount', { required: true, valueAsNumber: true })}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Due date</label>
                  <input type="date" {...form.register('dueDate', { required: true })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
                </div>
                <button className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white" type="submit">
                  Assign fee
                </button>
              </form>
            </div>

            {receipt && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Receipt</h2>
                  <button className="text-sm text-slate-500" onClick={() => setReceipt(null)}>
                    Close
                  </button>
                </div>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="font-medium text-slate-500">Reference</dt>
                    <dd className="text-slate-900">{receipt.reference}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-slate-500">Paid on</dt>
                    <dd className="text-slate-900">{new Date(receipt.paidOn).toLocaleDateString()}</dd>
                  </div>
                  {receipt.notes && (
                    <div className="flex justify-between">
                      <dt className="font-medium text-slate-500">Notes</dt>
                      <dd className="text-slate-900">{receipt.notes}</dd>
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
