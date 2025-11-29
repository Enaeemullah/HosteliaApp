import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const AppShell = ({ children }: { children: React.ReactNode }) => (
  <div className="mono-layout">
    <Sidebar />
    <div className="mono-main">
      <Topbar />
      <main className="mono-content">{children}</main>
    </div>
  </div>
);
