import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyD3MBXGcEmrf9jmqyJbHTyEjulKYc5mm3o',
  authDomain: 'memory-search-98cd4.firebaseapp.com',
  projectId: 'memory-search-98cd4',
  storageBucket: 'memory-search-98cd4.firebasestorage.app',
  messagingSenderId: '890100655240',
  appId: '1:890100655240:web:4f16aaf7aa047b3df1eb3d',
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

export default app;