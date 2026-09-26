import MemoryItem from '../components/MemoryItem';

function Favorites({ memories, toggleFavorite, removeMemory }) {
  const favorites = memories.filter((memory) => memory.favorite);
  return (
    <section className="page-container">
      <p className="section-label">FAVORITES</p><h2>Favorite Memories</h2>
      <p className="page-description">Keep your most important memories together.</p>
      <div className="panel">
        {favorites.length === 0 ? (
          <div className="page-placeholder"><div className="placeholder-icon">⭐</div><h3>No favorites yet</h3><p>Select the star beside a memory to save it here.</p></div>
        ) : (
          <div className="memory-list">{favorites.map((memory) => <MemoryItem key={memory.id} {...memory} toggleFavorite={toggleFavorite} removeMemory={removeMemory} />)}</div>
        )}
      </div>
    </section>
  );
}
export default Favorites;
