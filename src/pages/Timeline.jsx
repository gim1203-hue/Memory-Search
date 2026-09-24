import MemoryItem from '../components/MemoryItem';

function Timeline({ memories, toggleFavorite, removeMemory }) {
  const sortedMemories = [...memories].sort((a, b) => b.id - a.id);
  return (
    <section className="page-container">
      <p className="section-label">TIMELINE</p><h2>Memory Timeline</h2>
      <p className="page-description">Review all your memories from newest to oldest.</p>
      <div className="panel">
        {sortedMemories.length === 0 ? (
          <div className="page-placeholder"><div className="placeholder-icon">🕒</div><h3>No memories yet</h3><p>Add your first memory from the Dashboard.</p></div>
        ) : (
          <div className="memory-list">{sortedMemories.map((memory) => <MemoryItem key={memory.id} {...memory} toggleFavorite={toggleFavorite} removeMemory={removeMemory} />)}</div>
        )}
      </div>
    </section>
  );
}
export default Timeline;
