import { useState } from 'react';
import MemoryItem from '../components/MemoryItem';

function Search({
  memories,
  toggleFavorite,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const normalizedSearch = searchTerm
    .trim()
    .toLowerCase();

  const filteredMemories = memories.filter((memory) => {
    if (!normalizedSearch) {
      return false;
    }

    const searchableText = `
      ${memory.title}
      ${memory.description}
      ${memory.category}
      ${memory.time}
    `.toLowerCase();

    return searchableText.includes(normalizedSearch);
  });

  return (
    <section className="page-container">
      <p className="section-label">SEARCH</p>

      <h2>Search Your Memories</h2>

      <p className="page-description">
        Search your notes, photos, videos, voice memos, categories, and times.
      </p>

      <div className="search-section page-search">
        <span className="search-icon">🔎</span>

        <input
          type="text"
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
          placeholder="What are you trying to remember?"
        />
      </div>

      <div className="panel">
        <div className="panel-heading">
          <div>
            <p className="section-label">
              SEARCH RESULTS
            </p>

            <h3>
              {searchTerm.trim()
                ? `Results for "${searchTerm}"`
                : 'Start Searching'}
            </h3>
          </div>
        </div>

        {!searchTerm.trim() ? (
          <div className="page-placeholder">
            <div className="placeholder-icon">🔎</div>

            <h3>Search Your Memories</h3>

            <p>
              Type a title, description, category, or time above.
            </p>
          </div>
        ) : filteredMemories.length === 0 ? (
          <div className="page-placeholder">
            <div className="placeholder-icon">🔎</div>

            <h3>No Memories Found</h3>

            <p>
              Try another word or phrase.
            </p>
          </div>
        ) : (
          <div className="memory-list">
            {filteredMemories.map((memory) => (
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
        )}
      </div>
    </section>
  );
}

export default Search;