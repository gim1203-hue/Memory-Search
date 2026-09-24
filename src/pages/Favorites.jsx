import MemoryItem from '../components/MemoryItem';

function Favorites({ memories, toggleFavorite }) {
  const favoriteMemories = memories.filter(
    (memory) => memory.favorite
  );

  return (
    <section className="page-container">
      <p className="section-label">FAVORITES</p>

      <h2>Favorite Memories</h2>

      <p className="page-description">
        Keep your most important memories together in one place.
      </p>

      <div className="panel">
        <div className="panel-heading">
          <div>
            <p className="section-label">SAVED</p>
            <h3>Your Favorites</h3>
          </div>
        </div>

        {favoriteMemories.length === 0 ? (
          <div className="page-placeholder">
            <div className="placeholder-icon">⭐</div>

            <h3>No Favorite Memories Yet</h3>

            <p>
              Go to the Dashboard and click the star beside a memory.
              It will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="memory-list">
            {favoriteMemories.map((memory) => (
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

export default Favorites;