'use client';
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { openDB } from 'idb';
import videoReducer from './slices/videoSlice';

// Create IndexedDB database
const setupDB = async () => {
    if (typeof window === 'undefined') return null;
    const db = await openDB('clipjs-store', 1, {
        upgrade(db) {
            db.createObjectStore('state');
            db.createObjectStore('files', { keyPath: 'id' });
        },
    });
    return db;
};

// Load state from IndexedDB
const loadState = async () => {
    if (typeof window === 'undefined') return undefined;
    try {
        const db = await setupDB();
        if (!db) return undefined;
        const state = await db.get('state', 'root');
        return state || undefined;
    } catch (error) {
        console.error('Error loading state from IndexedDB:', error);
        return undefined;
    }
};

// Save state to IndexedDB
const saveState = async (state: any) => {
    if (typeof window === 'undefined') return;
    try {
        const db = await setupDB();
        if (!db) return;
        await db.put('state', state, 'root');
    } catch (error) {
        console.error('Error saving state to IndexedDB:', error);
    }
};

// File storage functions
export const storeFile = async (file: File) => {
    if (typeof window === 'undefined') return null;
    try {
        const db = await setupDB();
        if (!db) return null;

        const fileId = crypto.randomUUID();
        const fileData = {
            id: fileId,
            file: file,
        };

        await db.put('files', fileData);
        return fileId;
    } catch (error) {
        console.error('Error storing file:', error);
        return null;
    }
};

export const getFile = async (fileId: string) => {
    if (typeof window === 'undefined') return null;
    try {
        const db = await setupDB();
        if (!db) return null;

        const fileData = await db.get('files', fileId);
        if (!fileData) return null;

        return fileData.file;
    } catch (error) {
        console.error('Error retrieving file:', error);
        return null;
    }
};

export const deleteFile = async (fileId: string) => {
    if (typeof window === 'undefined') return;
    try {
        const db = await setupDB();
        if (!db) return;
        await db.delete('files', fileId);
    } catch (error) {
        console.error('Error deleting file:', error);
    }
};

export const listFiles = async () => {
    if (typeof window === 'undefined') return [];
    try {
        const db = await setupDB();
        if (!db) return [];
        return await db.getAll('files');
    } catch (error) {
        console.error('Error listing files:', error);
        return [];
    }
};

export const store = configureStore({
    reducer: {
        video: videoReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

// Subscribe to store changes to save to IndexedDB
if (typeof window !== 'undefined') {
    store.subscribe(() => {
        const state = store.getState();
        saveState(state);
    });

    // Load initial state from IndexedDB
    loadState().then((persistedState) => {
        if (persistedState) {
            store.dispatch({ type: 'REHYDRATE', payload: persistedState });
        }
    });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 