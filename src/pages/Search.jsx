import { useState } from 'react';
import MemoryItem from '../components/MemoryItem';

function Search({ memories, toggleFavorite, removeMemory }) {
  const [searchTerm, setSearchTerm] = useState('');
  const normalized = searchTerm.trim().toLowerCase();
  const results = normalized
    ? memories.filter((memory) => [memory.title, memory.description, memory.category, memory.date, memory.time].join(' ').toLowerCase().includes(normalized))
    : [];

  return (
    <section className="page-container">
      <p className="section-label">SEARCH</p><h2>Search Your Memories</h2>
      <p className="page-description">Search by title, description, category, date, or time.</p>
      <div className="search-section page-search"><span className="search-icon">🔎</span><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="What are you trying to remember?" autoFocus /></div>
      <div className="panel">
        {!normalized ? (
          <div className="page-placeholder"><div className="placeholder-icon">🔎</div><h3>Start searching</h3><p>Enter a word or date above.</p></div>
        ) : results.length === 0 ? (
          <div className="page-placeholder"><div className="placeholder-icon">🕵️</div><h3>No memories found</h3><p>Try another word or phrase.</p></div>
        ) : (
          <><p className="result-count">{results.length} {results.length === 1 ? 'result' : 'results'}</p><div className="memory-list">{results.map((memory) => <MemoryItem key={memory.id} {...memory} toggleFavorite={toggleFavorite} removeMemory={removeMemory} />)}</div></>
        )}
      </div>
    </section>
  );
}
export default Search;
