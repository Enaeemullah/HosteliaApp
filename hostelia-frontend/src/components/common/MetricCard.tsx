type Props = {
  label: string;
  value: string | number;
  helper?: string;
};

export const MetricCard = ({ label, value, helper }: Props) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <p className="text-sm text-slate-500">{label}</p>
    <p className="text-3xl font-bold text-slate-900">{value}</p>
    {helper && <p className="text-xs text-slate-400 mt-1">{helper}</p>}
  </div>
);
