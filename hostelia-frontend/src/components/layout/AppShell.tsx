import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const AppShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-slate-50 text-slate-900 flex">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <Topbar />
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  </div>
);
