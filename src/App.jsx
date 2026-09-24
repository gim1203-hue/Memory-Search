import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import './App.css';

import Header from './components/Header';
import Sidebar from './components/Sidebar';

import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Timeline from './pages/Timeline';
import Search from './pages/Search';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';

function App() {
  const today = new Date();

  const todayKey = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [memories, setMemories] = useState(() => {
    const savedMemories = localStorage.getItem(
      'memory-search-memories'
    );

    if (savedMemories) {
      try {
        return JSON.parse(savedMemories);
      } catch (error) {
        console.error(
          'Could not load saved memories:',
          error
        );
      }
    }

    return [
      {
        id: 1,
        date: todayKey,
        time: '8:15 AM',
        icon: '📝',
        title: 'Morning note',
        description:
          'Started the day by planning the most important things I want to remember.',
        category: 'Personal',
        favorite: false,
      },
      {
        id: 2,
        date: todayKey,
        time: '11:30 AM',
        icon: '📸',
        title: 'Afternoon photo',
        description:
          'Saved a photo so I can return to this moment later.',
        category: 'Daily Life',
        favorite: false,
      },
      {
        id: 3,
        date: todayKey,
        time: '3:45 PM',
        icon: '🎙️',
        title: 'Voice memo',
        description:
          'Recorded a quick thought that I did not want to forget.',
        category: 'Important',
        favorite: false,
      },
    ];
  });

  useEffect(() => {
    const memoriesToSave = memories.filter(
      (memory) => !memory.mediaUrl
    );

    localStorage.setItem(
      'memory-search-memories',
      JSON.stringify(memoriesToSave)
    );
  }, [memories]);

  function toggleFavorite(id) {
    setMemories((currentMemories) =>
      currentMemories.map((memory) =>
        memory.id === id
          ? {
              ...memory,
              favorite: !memory.favorite,
            }
          : memory
      )
    );
  }

  function addMemory(newMemory) {
    setMemories((currentMemories) => [
      ...currentMemories,
      newMemory,
    ]);
  }

  return (
    <div className="app">
      <Header />

      <div className="app-body">
        <Sidebar />

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  memories={memories}
                  toggleFavorite={toggleFavorite}
                  addMemory={addMemory}
                />
              }
            />

            <Route
              path="/calendar"
              element={
                <Calendar
                  memories={memories}
                  toggleFavorite={toggleFavorite}
                />
              }
            />

            <Route
              path="/timeline"
              element={
                <Timeline
                  memories={memories}
                  toggleFavorite={toggleFavorite}
                />
              }
            />

            <Route
              path="/search"
              element={
                <Search
                  memories={memories}
                  toggleFavorite={toggleFavorite}
                />
              }
            />

            <Route
              path="/favorites"
              element={
                <Favorites
                  memories={memories}
                  toggleFavorite={toggleFavorite}
                />
              }
            />

            <Route
              path="/settings"
              element={<Settings />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;