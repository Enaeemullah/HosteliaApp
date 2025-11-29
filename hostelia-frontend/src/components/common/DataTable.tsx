type Column<T> = {
  key: keyof T;
  label: string;
  render?: (row: T) => React.ReactNode;
};

type Props<T> = {
  data: T[];
  columns: Column<T>[];
  empty?: string;
};

export function DataTable<T extends { id?: string }>({ data, columns, empty }: Props<T>) {
  if (!data.length) {
    return <div className="mono-empty">{empty || 'No records yet.'}</div>;
  }
  return (
    <div className="mono-table-wrapper">
      <table className="mono-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key as string}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id ?? JSON.stringify(row)}>
              {columns.map((col) => (
                <td key={col.key as string}>{col.render ? col.render(row) : (row[col.key] as React.ReactNode)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
