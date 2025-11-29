import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Footer } from './Footer';

export const AppShell = ({ children }: { children: React.ReactNode }) => (
  <div className="mono-layout">
    <Sidebar />
    <div className="mono-main">
      <Topbar />
      <main className="mono-content">{children}</main>
      <Footer />
    </div>
  </div>
);
