import { useAuth } from '../../state/AuthContext';

export const Topbar = () => {
  const { user, signout } = useAuth();
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
      <div>
        <p className="text-sm text-slate-500">Logged in as</p>
        <p className="text-base font-semibold">{user?.email}</p>
      </div>
      <button
        onClick={signout}
        className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
      >
        Sign out
      </button>
    </header>
  );
};
