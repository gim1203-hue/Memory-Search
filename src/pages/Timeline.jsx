import MemoryItem from '../components/MemoryItem';

function Timeline({
  memories,
  toggleFavorite,
}) {
  return (
    <section className="page-container">
      <p className="section-label">TIMELINE</p>

      <h2>Memory Timeline</h2>

      <p className="page-description">
        Review your memories in chronological order throughout the day.
      </p>

      <div className="panel">
        <div className="panel-heading">
          <div>
            <p className="section-label">TODAY</p>
            <h3>Today's Activity</h3>
          </div>
        </div>

        {memories.length === 0 ? (
          <div className="page-placeholder">
            <div className="placeholder-icon">🕒</div>

            <h3>No Memories Yet</h3>

            <p>
              Add a memory from the Dashboard and it will appear here.
            </p>
          </div>
        ) : (
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
        )}
      </div>
    </section>
  );
}

export default Timeline;