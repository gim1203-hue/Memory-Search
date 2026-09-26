function Header({ theme, toggleTheme }) {
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
        <button
          className="icon-button"
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <div className="profile-circle" title="Local profile">MS</div>
      </div>
    </header>
  );
}

export default Header;
