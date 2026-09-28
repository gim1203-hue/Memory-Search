import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';

import {
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';

import './App.css';

import Header from './components/Header';
import Sidebar from './components/Sidebar';

import Calendar from './pages/Calendar';
import Dashboard from './pages/Dashboard';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Search from './pages/Search';
import Settings from './pages/Settings';
import Timeline from './pages/Timeline';

import {
  auth,
  db,
} from './firebaseConfig';

import {
  clearMedia,
  deleteMedia,
  getMedia,
  saveMedia,
} from './services/mediaDB';

function makeDateKey(date) {
  return `${date.getFullYear()}-${String(
    date.getMonth() + 1,
  ).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`;
}

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [memories, setMemories] = useState([]);
  const [storageError, setStorageError] = useState('');

  const [theme, setTheme] = useState(
    () =>
      localStorage.getItem('memory-search-theme') ||
      'light',
  );

  // -----------------------------
  // FIREBASE AUTHENTICATION
  // -----------------------------

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setAuthLoading(false);

        if (!firebaseUser) {
          setMemories([]);
        }
      },
    );

    return unsubscribe;
  }, []);

  // -----------------------------
  // LOAD USER'S FIRESTORE MEMORIES
  // -----------------------------

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function loadMemories() {
      try {
        setStorageError('');

        const memoryCollection = collection(
          db,
          'users',
          user.uid,
          'memories',
        );

        const snapshot =
          await getDocs(memoryCollection);

        const loadedMemories =
          await Promise.all(
            snapshot.docs.map(
              async (memoryDoc) => {
                const memory = {
                  id: memoryDoc.id,
                  ...memoryDoc.data(),
                };

                // Restore media from this device.
                if (memory.mediaType) {
                  try {
                    const localMedia =
                      await getMedia(
                        user.uid,
                        memory.id,
                      );

                    if (localMedia?.blob) {
                      return {
                        ...memory,

                        mediaUrl:
                          URL.createObjectURL(
                            localMedia.blob,
                          ),
                      };
                    }
                  } catch (error) {
                    console.error(
                      'Could not restore local media:',
                      error,
                    );
                  }
                }

                return memory;
              },
            ),
          );

        if (!cancelled) {
          setMemories(loadedMemories);
        }
      } catch (error) {
        console.error(
          'Could not load memories:',
          error,
        );

        if (!cancelled) {
          setStorageError(
            'Your memories could not be loaded.',
          );
        }
      }
    }

    loadMemories();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // -----------------------------
  // THEME
  // -----------------------------

  useEffect(() => {
    document.documentElement.dataset.theme =
      theme;

    localStorage.setItem(
      'memory-search-theme',
      theme,
    );
  }, [theme]);

  // -----------------------------
  // ADD MEMORY
  // -----------------------------

  async function addMemory(
    memory,
    mediaBlob,
  ) {
    if (!user) return false;

    setStorageError('');

    try {
      const memoryCollection = collection(
        db,
        'users',
        user.uid,
        'memories',
      );

      // Do not save temporary browser URLs
      // or old local IDs into Firestore.
      const {
        id: oldId,
        mediaUrl: oldMediaUrl,
        ...memoryData
      } = memory;

      void oldId;
      void oldMediaUrl;

      // Save metadata to Firestore.
      const documentReference =
        await addDoc(
          memoryCollection,
          memoryData,
        );

      let finalMemory = {
        ...memoryData,
        id: documentReference.id,
      };

      // Save photo/video/audio locally
      // in IndexedDB.
      if (
        mediaBlob &&
        memory.mediaType
      ) {
        await saveMedia(
          user.uid,
          documentReference.id,
          mediaBlob,
          memory.mediaType,
        );

        finalMemory = {
          ...finalMemory,

          mediaUrl:
            URL.createObjectURL(
              mediaBlob,
            ),
        };
      }

      setMemories((current) => [
        finalMemory,
        ...current,
      ]);

      return true;
    } catch (error) {
      console.error(
        'Could not save memory:',
        error,
      );

      setStorageError(
        'The memory could not be saved. Please try again.',
      );

      return false;
    }
  }

  // -----------------------------
  // FAVORITES
  // -----------------------------

  async function toggleFavorite(id) {
    if (!user) return;

    const memory =
      memories.find(
        (item) => item.id === id,
      );

    if (!memory) return;

    const favorite =
      !memory.favorite;

    try {
      await updateDoc(
        doc(
          db,
          'users',
          user.uid,
          'memories',
          id,
        ),
        {
          favorite,
        },
      );

      setMemories((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                favorite,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error(
        'Could not update favorite:',
        error,
      );

      setStorageError(
        'The memory could not be updated.',
      );
    }
  }

  // -----------------------------
  // DELETE ONE MEMORY
  // -----------------------------

  async function removeMemory(id) {
    if (!user) return;

    const memory =
      memories.find(
        (item) => item.id === id,
      );

    try {
      // Delete local media.
      if (memory?.mediaType) {
        await deleteMedia(
          user.uid,
          id,
        );
      }

      // Remove temporary browser URL.
      if (memory?.mediaUrl) {
        URL.revokeObjectURL(
          memory.mediaUrl,
        );
      }

      // Delete Firestore document.
      await deleteDoc(
        doc(
          db,
          'users',
          user.uid,
          'memories',
          id,
        ),
      );

      setMemories((current) =>
        current.filter(
          (item) => item.id !== id,
        ),
      );
    } catch (error) {
      console.error(
        'Could not delete memory:',
        error,
      );

      setStorageError(
        'The memory could not be deleted. Please try again.',
      );
    }
  }

  // -----------------------------
  // DELETE ALL MEMORIES
  // -----------------------------

  async function removeAllMemories() {
    if (!user) return;

    setStorageError('');

    try {
      // Delete local media belonging
      // only to this Firebase user.
      await clearMedia(user.uid);

      // Delete Firestore documents.
      const memoryCollection =
        collection(
          db,
          'users',
          user.uid,
          'memories',
        );

      const snapshot =
        await getDocs(memoryCollection);

      await Promise.all(
        snapshot.docs.map(
          (memoryDocument) =>
            deleteDoc(
              doc(
                db,
                'users',
                user.uid,
                'memories',
                memoryDocument.id,
              ),
            ),
        ),
      );

      // Release temporary browser URLs.
      memories.forEach((memory) => {
        if (memory.mediaUrl) {
          URL.revokeObjectURL(
            memory.mediaUrl,
          );
        }
      });

      setMemories([]);
    } catch (error) {
      console.error(
        'Could not clear memories:',
        error,
      );

      setStorageError(
        'Could not clear your memories.',
      );
    }
  }

  // -----------------------------
  // EXPORT
  // -----------------------------

  function exportMemories() {
    const data = memories.map(
      ({
        mediaUrl,
        ...memory
      }) => {
        void mediaUrl;

        return memory;
      },
    );

    const blob = new Blob(
      [
        JSON.stringify(
          data,
          null,
          2,
        ),
      ],
      {
        type: 'application/json',
      },
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement('a');

    link.href = url;

    link.download =
      `memory-search-${makeDateKey(
        new Date(),
      )}.json`;

    link.click();

    URL.revokeObjectURL(url);
  }

  // -----------------------------
  // SIGN OUT
  // -----------------------------

  async function handleSignOut() {
    memories.forEach((memory) => {
      if (memory.mediaUrl) {
        URL.revokeObjectURL(
          memory.mediaUrl,
        );
      }
    });

    await signOut(auth);
  }

  // -----------------------------
  // THEME BUTTON
  // -----------------------------

  const toggleTheme = () =>
    setTheme((current) =>
      current === 'light'
        ? 'dark'
        : 'light',
    );

  // -----------------------------
  // AUTH LOADING
  // -----------------------------

  if (authLoading) {
    return (
      <div className="login-page">
        <p>
          Loading Memory Search...
        </p>
      </div>
    );
  }

  // -----------------------------
  // LOGIN PAGE
  // -----------------------------

  if (!user) {
    return <Login />;
  }

  const pageProps = {
    memories,
    toggleFavorite,
    removeMemory,
  };

  // -----------------------------
  // MAIN APP
  // -----------------------------

  return (
    <div className="app">

      <Header
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <div className="app-body">

        <Sidebar />

        <main className="main-content">

          <div className="user-account-bar">

            {user.photoURL && (
              <img
                src={user.photoURL}
                alt=""
                className="user-avatar"
              />
            )}

            <div>
              <strong>
                {user.displayName ||
                  'Memory Search User'}
              </strong>

              <small>
                {user.email}
              </small>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
            >
              Sign Out
            </button>

          </div>

          {storageError && (
            <p className="app-message error-message">
              {storageError}
            </p>
          )}

          <Routes>

            <Route
              path="/"
              element={
                <Dashboard
                  {...pageProps}
                  addMemory={
                    addMemory
                  }
                />
              }
            />

            <Route
              path="/calendar"
              element={
                <Calendar
                  {...pageProps}
                />
              }
            />

            <Route
              path="/timeline"
              element={
                <Timeline
                  {...pageProps}
                />
              }
            />

            <Route
              path="/search"
              element={
                <Search
                  {...pageProps}
                />
              }
            />

            <Route
              path="/favorites"
              element={
                <Favorites
                  {...pageProps}
                />
              }
            />

            <Route
              path="/settings"
              element={
                <Settings
                  theme={theme}
                  toggleTheme={
                    toggleTheme
                  }
                  exportMemories={
                    exportMemories
                  }
                  removeAllMemories={
                    removeAllMemories
                  }
                  memoryCount={
                    memories.length
                  }
                />
              }
            />

            <Route
              path="*"
              element={
                <Navigate
                  to="/"
                  replace
                />
              }
            />

          </Routes>

        </main>
      </div>
    </div>
  );
}

export default App;