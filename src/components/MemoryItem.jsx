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
}) {
  return (
    <article className="memory-item">
      <div className="memory-time">{time}</div>

      <div className="memory-details">
        <div className="memory-type">{icon}</div>

        <div className="memory-content">
          <h4>{title}</h4>

          <p>{description}</p>

          {mediaType === 'photo' && mediaUrl && (
            <img
              src={mediaUrl}
              alt={title}
              className="memory-photo"
            />
          )}

          {mediaType === 'video' && mediaUrl && (
            <video
              className="memory-video"
              controls
              preload="metadata"
            >
              <source src={mediaUrl} />

              Your browser does not support video playback.
            </video>
          )}

          {mediaType === 'audio' && mediaUrl && (
            <audio
              className="memory-audio"
              controls
              preload="metadata"
              src={mediaUrl}
            >
              Your browser does not support audio playback.
            </audio>
          )}

          <span className="category">
            {category}
          </span>
        </div>
      </div>

      <button
        className="favorite-button"
        type="button"
        onClick={() => toggleFavorite(id)}
        aria-label={
          favorite
            ? `Remove ${title} from favorites`
            : `Add ${title} to favorites`
        }
      >
        {favorite ? '★' : '☆'}
      </button>
    </article>
  );
}

export default MemoryItem;