function Settings({ theme, toggleTheme, exportMemories, removeAllMemories, memoryCount }) {
  async function handleClear() {
    if (window.confirm(`Delete all ${memoryCount} memories? This cannot be undone.`)) {
      await removeAllMemories();
    }
  }

  return (
    <section className="page-container">
      <p className="section-label">SETTINGS</p><h2>Memory Search Settings</h2>
      <p className="page-description">Manage appearance and your locally stored data.</p>
      <div className="panel settings-list">
        <div className="setting-row"><div><h3>Appearance</h3><p>Switch between light and dark mode.</p></div><button type="button" className="secondary-button" onClick={toggleTheme}>{theme === 'light' ? 'Use dark mode' : 'Use light mode'}</button></div>
        <div className="setting-row"><div><h3>Export metadata</h3><p>Download titles, descriptions, dates, and categories as JSON. Media files are not included.</p></div><button type="button" className="secondary-button" onClick={exportMemories} disabled={!memoryCount}>Export</button></div>
        <div className="setting-row danger-setting"><div><h3>Delete all memories</h3><p>Remove all notes and media stored in this browser.</p></div><button type="button" className="danger-button" onClick={handleClear} disabled={!memoryCount}>Delete all</button></div>
      </div>
      <p className="privacy-note">Privacy: your memories stay in this browser using localStorage and IndexedDB. They are not uploaded to GitHub or Firebase.</p>
    </section>
  );
}
export default Settings;
