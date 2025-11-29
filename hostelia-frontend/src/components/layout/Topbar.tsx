import { useAuth } from '../../state/AuthContext';

export const Topbar = () => {
  const { user, signout } = useAuth();
  return (
    <header className="mono-topbar">
      <div>
        <p className="mono-label">Operator</p>
        <p className="mono-topbar__user">{user?.email ?? '—'}</p>
      </div>
      <button onClick={signout} className="mono-button mono-button--ghost">
        Logout
      </button>
    </header>
  );
};
