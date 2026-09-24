import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Calendar from './pages/Calendar';
import Dashboard from './pages/Dashboard';
import Favorites from './pages/Favorites';
import Search from './pages/Search';
import Settings from './pages/Settings';
import Timeline from './pages/Timeline';
import { clearMedia, deleteMedia, getMedia, saveMedia } from './services/mediaDB';

const STORAGE_KEY = 'memory-search-memories';

function makeDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`;
}

function starterMemories() {
  return [{
    id: 1,
    date: makeDateKey(new Date()),
    time: '8:15 AM',
    icon: '📝',
    title: 'Morning note',
    description: 'Started the day by planning what I want to remember.',
    category: 'Personal',
    favorite: false,
  }];
}

function readMemories() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : starterMemories();
  } catch (error) {
    console.error('Could not load saved memories:', error);
    return starterMemories();
  }
}

function App() {
  const [memories, setMemories] = useState(readMemories);
  const [storageError, setStorageError] = useState('');
  const [theme, setTheme] = useState(
    () => localStorage.getItem('memory-search-theme') || 'light',
  );

  useEffect(() => {
    let cancelled = false;

    async function restoreMedia() {
      const restored = await Promise.all(
        readMemories().map(async (memory) => {
          if (!memory.mediaType) return memory;
          try {
            const media = await getMedia(memory.id);
            return media?.blob
              ? { ...memory, mediaUrl: URL.createObjectURL(media.blob) }
              : memory;
          } catch (error) {
            console.error('Could not restore media:', error);
            return memory;
          }
        }),
      );
      if (!cancelled) setMemories(restored);
    }

    restoreMedia();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const data = memories.map(({ mediaUrl, ...memory }) => {
      void mediaUrl;
      return memory;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [memories]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('memory-search-theme', theme);
  }, [theme]);

  async function addMemory(memory, mediaBlob) {
    setStorageError('');
    try {
      let storedMemory = memory;
      if (mediaBlob && memory.mediaType) {
        await saveMedia(memory.id, mediaBlob, memory.mediaType);
        storedMemory = { ...memory, mediaUrl: URL.createObjectURL(mediaBlob) };
      }
      setMemories((current) => [storedMemory, ...current]);
      return true;
    } catch (error) {
      console.error('Could not save memory:', error);
      setStorageError('The memory could not be saved. Please try again.');
      return false;
    }
  }

  function toggleFavorite(id) {
    setMemories((current) =>
      current.map((memory) =>
        memory.id === id ? { ...memory, favorite: !memory.favorite } : memory,
      ),
    );
  }

  async function removeMemory(id) {
    const memory = memories.find((item) => item.id === id);
    try {
      if (memory?.mediaType) await deleteMedia(id);
      if (memory?.mediaUrl) URL.revokeObjectURL(memory.mediaUrl);
      setMemories((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Could not delete memory:', error);
      setStorageError('The memory could not be deleted. Please try again.');
    }
  }

  async function removeAllMemories() {
    await clearMedia();
    memories.forEach((memory) => {
      if (memory.mediaUrl) URL.revokeObjectURL(memory.mediaUrl);
    });
    setMemories([]);
  }

  function exportMemories() {
    const data = memories.map(({ mediaUrl, ...memory }) => {
      void mediaUrl;
      return memory;
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `memory-search-${makeDateKey(new Date())}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const toggleTheme = () =>
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  const pageProps = { memories, toggleFavorite, removeMemory };

  return (
    <div className="app">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <div className="app-body">
        <Sidebar />
        <main className="main-content">
          {storageError && <p className="app-message error-message">{storageError}</p>}
          <Routes>
            <Route path="/" element={<Dashboard {...pageProps} addMemory={addMemory} />} />
            <Route path="/calendar" element={<Calendar {...pageProps} />} />
            <Route path="/timeline" element={<Timeline {...pageProps} />} />
            <Route path="/search" element={<Search {...pageProps} />} />
            <Route path="/favorites" element={<Favorites {...pageProps} />} />
            <Route
              path="/settings"
              element={
                <Settings
                  theme={theme}
                  toggleTheme={toggleTheme}
                  exportMemories={exportMemories}
                  removeAllMemories={removeAllMemories}
                  memoryCount={memories.length}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
