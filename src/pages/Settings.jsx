function Settings() {
  return (
    <section className="page-container">
      <p className="section-label">SETTINGS</p>

      <h2>Memory Search Settings</h2>

      <p className="page-description">
        Customize how Memory Search looks and behaves.
      </p>

      <div className="panel settings-list">
        <div className="setting-row">
          <div>
            <h3>Appearance</h3>

            <p>
              Choose between light mode and dark mode.
            </p>
          </div>

          <button
            type="button"
            className="secondary-button"
          >
            Light
          </button>
        </div>

        <div className="setting-row">
          <div>
            <h3>Language</h3>

            <p>
              Choose the language used by Memory Search.
            </p>
          </div>

          <button
            type="button"
            className="secondary-button"
          >
            English
          </button>
        </div>

        <div className="setting-row">
          <div>
            <h3>Memory Categories</h3>

            <p>
              Manage Personal, Family, Work, Travel,
              Important, and other categories.
            </p>
          </div>

          <button
            type="button"
            className="secondary-button"
          >
            Manage
          </button>
        </div>

        <div className="setting-row">
          <div>
            <h3>Notifications</h3>

            <p>
              Control future reminders and memory notifications.
            </p>
          </div>

          <button
            type="button"
            className="secondary-button"
          >
            Manage
          </button>
        </div>
      </div>
    </section>
  );
}

export default Settings;