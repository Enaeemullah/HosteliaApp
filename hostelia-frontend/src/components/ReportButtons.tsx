import api from '../api/client';

type Props = {
  hostelId: string;
};

const formats = [
  { label: 'CSV', value: 'csv' },
  { label: 'Excel', value: 'excel' },
  { label: 'PDF', value: 'pdf' },
];

export const ReportButtons = ({ hostelId }: Props) => {
  const download = async (format: string) => {
    const { data } = await api.get(`/hostels/${hostelId}/reports/${format}`);
    const blob = atob(data.data);
    const bytes = new Uint8Array(blob.length);
    for (let i = 0; i < blob.length; i += 1) {
      bytes[i] = blob.charCodeAt(i);
    }
    const url = window.URL.createObjectURL(new Blob([bytes], { type: data.mimeType }));
    const a = document.createElement('a');
    a.href = url;
    a.download = data.filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {formats.map((format) => (
        <button
          key={format.value}
          onClick={() => download(format.value)}
          className="rounded-md border border-primary px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10"
        >
          Export {format.label}
        </button>
      ))}
    </div>
  );
};
