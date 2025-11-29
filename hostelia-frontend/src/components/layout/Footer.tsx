export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mono-footer">
      <span className="mono-footer__brand">Hostelia</span>
      <span className="mono-footer__meta">Copyright {year} - Control Center</span>
    </footer>
  );
};
