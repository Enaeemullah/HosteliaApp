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
    className="mono-select"
  >
    {hostels.map((hostel) => (
      <option key={hostel.id} value={hostel.id}>
        {hostel.name}
      </option>
    ))}
  </select>
);
