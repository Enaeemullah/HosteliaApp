import { Hostel } from '../types';

type Props = {
  hostels: Hostel[];
  value?: string;
  onChange: (id: string) => void;
};

export const HostelSelector = ({ hostels, value, onChange }: Props) => (
  <select
    value={value}
    onChange={(event) => onChange(event.target.value)}
    className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-primary"
  >
    {hostels.map((hostel) => (
      <option key={hostel.id} value={hostel.id}>
        {hostel.name}
      </option>
    ))}
  </select>
);
