'use client';
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { openDB } from 'idb';
import projectStateReducer from './slices/projectSlice';

// Create IndexedDB database for files only
const setupDB = async () => {
    if (typeof window === 'undefined') return null;
    const db = await openDB('clipjs-files', 1, {
        upgrade(db) {
            db.createObjectStore('files', { keyPath: 'id' });
        },
    });
    return db;
};

// Load state from localStorage
export const loadState = () => {
    if (typeof window === 'undefined') return undefined;
    try {
        const serializedState = localStorage.getItem('clipjs-state');
        if (serializedState === null) return undefined;
        return JSON.parse(serializedState);
    } catch (error) {
        console.error('Error loading state from localStorage:', error);
        return undefined;
    }
};

// Save state to localStorage
const saveState = (state: any) => {
    if (typeof window === 'undefined') return;
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('clipjs-state', serializedState);
    } catch (error) {
        console.error('Error saving state to localStorage:', error);
    }
};

// File storage functions remain in IndexedDB
export const storeFile = async (file: File, fileId: string) => {
    if (typeof window === 'undefined') return null;
    try {
        const db = await setupDB();
        if (!db) return null;

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
        projectState: projectStateReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

// Load persisted state from localStorage
const persistedState = loadState();
if (persistedState) {
    store.dispatch({
        type: 'REPLACE_STATE',
        payload: persistedState
    });
}

// TODO: for some reason state get saved to localStorage twice when its none cause loss of old state i shall find better way to do this later
// Subscribe to store changes to save to localStorage
if (typeof window !== 'undefined') {
    let isInitial = 2;
    store.subscribe(() => {
        if (isInitial) {
            isInitial -= 1;
            return;
        }

        const state = store.getState();
        saveState(state);
    });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 