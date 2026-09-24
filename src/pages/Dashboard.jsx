import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import SummaryCard from '../components/SummaryCard';
import MemoryItem from '../components/MemoryItem';
import QuickActions from '../components/QuickActions';

function Dashboard({
  memories,
  toggleFavorite,
  addMemory,
}) {
  const location = useLocation();

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personal');
  const [type, setType] = useState('note');

  useEffect(() => {
    if (location.state?.openAddMemory) {
      setShowForm(true);
      setType(location.state.memoryType || 'note');
    }
  }, [location.state]);

  const photoCount = memories.filter(
    (memory) => memory.icon === '📸'
  ).length;

  const videoCount = memories.filter(
    (memory) => memory.icon === '🎥'
  ).length;

  const voiceMemoCount = memories.filter(
    (memory) => memory.icon === '🎙️'
  ).length;

  function getIcon() {
    if (type === 'photo') return '📸';
    if (type === 'video') return '🎥';
    if (type === 'voice') return '🎙️';

    return '📝';
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    const now = new Date();

    const dateKey = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')}`;

    const newMemory = {
      id: Date.now(),
      date: dateKey,
      time: now.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      }),
      icon: getIcon(),
      title: title.trim(),
      description: description.trim(),
      category,
      favorite: false,
    };

    addMemory(newMemory);

    setTitle('');
    setDescription('');
    setCategory('Personal');
    setType('note');
    setShowForm(false);
  }

  return (
    <>
      <section className="welcome-section">
        <div>
          <p className="section-label">
            PERSONAL LIFE DASHBOARD
          </p>

          <h2>Welcome to Memory Search</h2>

          <p className="welcome-text">
            Keep your notes, photos, videos, voice memories, and important
            moments organized by day.
          </p>
        </div>

        <button
          className="primary-button"
          type="button"
          onClick={() => setShowForm(true)}
        >
          + Add Memory
        </button>
      </section>

      {showForm && (
        <section className="panel add-memory-panel">
          <div className="panel-heading">
            <div>
              <p className="section-label">
                NEW MEMORY
              </p>

              <h3>Add Memory</h3>
            </div>

            <button
              type="button"
              className="text-button"
              onClick={() => setShowForm(false)}
            >
              Close
            </button>
          </div>

          <form
            className="memory-form"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label htmlFor="memory-title">
                Title
              </label>

              <input
                id="memory-title"
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="What do you want to remember?"
              />
            </div>

            <div className="form-group">
              <label htmlFor="memory-description">
                Description
              </label>

              <textarea
                id="memory-description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Add more details..."
                rows="4"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="memory-type">
                  Type
                </label>

                <select
                  id="memory-type"
                  value={type}
                  onChange={(event) =>
                    setType(event.target.value)
                  }
                >
                  <option value="note">
                    Note
                  </option>

                  <option value="photo">
                    Photo
                  </option>

                  <option value="video">
                    Video
                  </option>

                  <option value="voice">
                    Voice Memo
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="memory-category">
                  Category
                </label>

                <select
                  id="memory-category"
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                >
                  <option value="Personal">
                    Personal
                  </option>

                  <option value="Daily Life">
                    Daily Life
                  </option>

                  <option value="Important">
                    Important
                  </option>

                  <option value="Family">
                    Family
                  </option>

                  <option value="Work">
                    Work
                  </option>

                  <option value="Travel">
                    Travel
                  </option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
              >
                Save Memory
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="search-section">
        <span className="search-icon">🔎</span>

        <input
          type="text"
          placeholder="Search memories, dates, notes, people..."
        />
      </section>

      <section className="summary-grid">
        <SummaryCard
          icon="📝"
          label="Total Memories"
          value={memories.length}
        />

        <SummaryCard
          icon="📸"
          label="Photos"
          value={photoCount}
        />

        <SummaryCard
          icon="🎥"
          label="Videos"
          value={videoCount}
        />

        <SummaryCard
          icon="🎙️"
          label="Voice Memos"
          value={voiceMemoCount}
        />
      </section>

      <section className="content-grid">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <p className="section-label">
                TODAY
              </p>

              <h3>Today's Memories</h3>
            </div>

            <button
              className="text-button"
              type="button"
            >
              View all
            </button>
          </div>

          <div className="memory-list">
            {memories.map((memory) => (
              <MemoryItem
                key={memory.id}
                id={memory.id}
                time={memory.time}
                icon={memory.icon}
                title={memory.title}
                description={memory.description}
                category={memory.category}
                favorite={memory.favorite}
                toggleFavorite={toggleFavorite}
                mediaType={memory.mediaType}
                mediaUrl={memory.mediaUrl}
              />
            ))}
          </div>
        </div>

        <QuickActions addMemory={addMemory} />
      </section>
    </>
  );
}

export default Dashboard;