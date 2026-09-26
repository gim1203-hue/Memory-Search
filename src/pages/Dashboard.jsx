import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MemoryItem from '../components/MemoryItem';
import QuickActions from '../components/QuickActions';
import SummaryCard from '../components/SummaryCard';

function Dashboard({ memories, toggleFavorite, addMemory, removeMemory }) {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personal');
  const [formError, setFormError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim()) {
      setFormError('Please enter a title.');
      return;
    }

    const now = new Date();
    const saved = await addMemory({
      id: Date.now(),
      date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
        now.getDate(),
      ).padStart(2, '0')}`,
      time: now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      icon: '📝',
      title: title.trim(),
      description: description.trim(),
      category,
      favorite: false,
    });

    if (saved) {
      setTitle('');
      setDescription('');
      setCategory('Personal');
      setFormError('');
      setShowForm(false);
    }
  }

  const counts = {
    photo: memories.filter((memory) => memory.mediaType === 'photo').length,
    video: memories.filter((memory) => memory.mediaType === 'video').length,
    audio: memories.filter((memory) => memory.mediaType === 'audio').length,
  };

  return (
    <>
      <section className="welcome-section">
        <div>
          <p className="section-label">PERSONAL LIFE DASHBOARD</p>
          <h2>Welcome to Memory Search</h2>
          <p className="welcome-text">
            Keep notes, photos, videos, voice memories, and important moments organized by day.
          </p>
        </div>
        <button className="primary-button" type="button" onClick={() => setShowForm(true)}>
          + Add Note
        </button>
      </section>

      {showForm && (
        <section className="panel add-memory-panel">
          <div className="panel-heading">
            <div><p className="section-label">NEW MEMORY</p><h3>Add a Note</h3></div>
            <button type="button" className="text-button" onClick={() => setShowForm(false)}>Close</button>
          </div>
          <form className="memory-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="memory-title">Title</label>
              <input id="memory-title" value={title} maxLength="80" onChange={(event) => setTitle(event.target.value)} placeholder="What do you want to remember?" autoFocus />
            </div>
            <div className="form-group">
              <label htmlFor="memory-description">Description</label>
              <textarea id="memory-description" value={description} maxLength="500" onChange={(event) => setDescription(event.target.value)} placeholder="Add more details..." rows="4" />
            </div>
            <div className="form-group">
              <label htmlFor="memory-category">Category</label>
              <select id="memory-category" value={category} onChange={(event) => setCategory(event.target.value)}>
                {['Personal', 'Daily Life', 'Important', 'Family', 'Work', 'Travel'].map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            {formError && <p className="form-error" role="alert">{formError}</p>}
            <div className="form-actions">
              <button type="button" className="secondary-button" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="primary-button">Save Memory</button>
            </div>
          </form>
        </section>
      )}

      <button className="search-section dashboard-search" type="button" onClick={() => navigate('/search')}>
        <span className="search-icon">🔎</span><span>Search memories, dates, notes, and categories...</span>
      </button>

      <section className="summary-grid">
        <SummaryCard icon="📝" label="Total Memories" value={memories.length} />
        <SummaryCard icon="📷" label="Photos" value={counts.photo} />
        <SummaryCard icon="🎥" label="Videos" value={counts.video} />
        <SummaryCard icon="🎙️" label="Voice Memos" value={counts.audio} />
      </section>

      <section className="content-grid">
        <div className="panel">
          <div className="panel-heading"><div><p className="section-label">RECENT</p><h3>Your Memories</h3></div></div>
          {memories.length === 0 ? (
            <div className="page-placeholder"><div className="placeholder-icon">🗂️</div><h3>No memories yet</h3><p>Add a note or use Quick Access to save media.</p></div>
          ) : (
            <div className="memory-list">
              {memories.slice(0, 8).map((memory) => (
                <MemoryItem key={memory.id} {...memory} toggleFavorite={toggleFavorite} removeMemory={removeMemory} />
              ))}
            </div>
          )}
        </div>
        <QuickActions addMemory={addMemory} openNoteForm={() => setShowForm(true)} />
      </section>
    </>
  );
}

export default Dashboard;
