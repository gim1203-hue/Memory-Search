function MemoryItem({
  id,
  time,
  icon,
  title,
  description,
  category,
  favorite,
  toggleFavorite,
  mediaType,
  mediaUrl,
  removeMemory,
}) {
  async function handleDelete() {
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      await removeMemory(id);
    }
  }

  return (
    <article className="memory-item">
      <div className="memory-time">{time}</div>
      <div className="memory-details">
        <div className="memory-type">{icon}</div>
        <div className="memory-content">
          <h4>{title}</h4>
          {description && <p>{description}</p>}

          {mediaType === 'photo' && mediaUrl && (
            <img src={mediaUrl} alt={title} className="memory-photo" />
          )}
          {mediaType === 'video' && mediaUrl && (
            <video className="memory-video" controls preload="metadata" src={mediaUrl}>
              Your browser does not support video playback.
            </video>
          )}
          {mediaType === 'audio' && mediaUrl && (
            <audio className="memory-audio" controls preload="metadata" src={mediaUrl}>
              Your browser does not support audio playback.
            </audio>
          )}
          {mediaType && !mediaUrl && (
            <p className="media-unavailable">The saved media file is unavailable in this browser.</p>
          )}
          <span className="category">{category}</span>
        </div>
      </div>

      <div className="memory-actions">
        <button
          className="favorite-button"
          type="button"
          onClick={() => toggleFavorite(id)}
          aria-label={favorite ? `Remove ${title} from favorites` : `Add ${title} to favorites`}
          title={favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {favorite ? '★' : '☆'}
        </button>
        <button
          className="delete-button"
          type="button"
          onClick={handleDelete}
          aria-label={`Delete ${title}`}
          title="Delete memory"
        >
          ×
        </button>
      </div>
    </article>
  );
}

export default MemoryItem;
