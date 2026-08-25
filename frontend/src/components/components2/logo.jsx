function LogoMark() {
  return (
    <svg className="logo-mark" viewBox="0 0 64 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="30" cy="21" r="11" /><circle cx="16" cy="13" r="4" /><circle cx="9" cy="21" r="3.3" />
      <circle cx="11" cy="30" r="2.9" /><circle cx="19" cy="36" r="3.4" /><circle cx="29" cy="38" r="3" />
      <circle cx="40" cy="34" r="3.8" /><circle cx="46" cy="25" r="3.4" /><circle cx="43" cy="14" r="3" />
      <circle cx="34" cy="7" r="2.8" /><circle cx="23" cy="7" r="2.4" />
    </svg>
  );
}

function Logo({ compact = false }) {
  return <Link to="/" className={`brand ${compact ? "compact" : ""}`}>
    <LogoMark />
    <span className="brand-text">
      <strong>FALKOM TAYYEB</strong>
      <small>EVENTS · EXHIBITION · CONFERENCE</small>
    </span>
  </Link>;
}
