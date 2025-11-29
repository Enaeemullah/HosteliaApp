type Props = {
  label: string;
  value: string | number;
  helper?: string;
};

export const MetricCard = ({ label, value, helper }: Props) => (
  <div className="mono-panel">
    <p className="mono-label">{label}</p>
    <p className="mono-metric__value">{value}</p>
    {helper && <p className="mono-note">{helper}</p>}
  </div>
);
