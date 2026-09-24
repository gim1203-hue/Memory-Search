function Header() {
  return (
    <header className="header">
      <div className="brand">
        <div className="brand-icon">M</div>

        <div>
          <h1>Memory Search</h1>
          <p>Remember your life, one day at a time.</p>
        </div>
      </div>

      <div className="header-actions">
        <button className="icon-button" type="button">
          ☀️
        </button>

        <div className="profile-circle">IK</div>
      </div>
    </header>
  );
}

export default Header;