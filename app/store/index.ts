import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { openDB } from 'idb';
import soundReducer from './slices/soundSlice';
import videoReducer from './slices/videoSlice';

// Create IndexedDB database
const setupDB = async () => {
    const db = await openDB('clipjs-store', 1, {
        upgrade(db) {
            db.createObjectStore('state');
        },
    });
    return db;
};

// Load state from IndexedDB
const loadState = async () => {
    try {
        const db = await setupDB();
        const state = await db.get('state', 'root');
        return state || undefined;
    } catch (error) {
        console.error('Error loading state from IndexedDB:', error);
        return undefined;
    }
};

// Save state to IndexedDB
const saveState = async (state: any) => {
    try {
        const db = await setupDB();
        await db.put('state', state, 'root');
    } catch (error) {
        console.error('Error saving state to IndexedDB:', error);
    }
};

export const store = configureStore({
    reducer: {
        sound: soundReducer,
        video: videoReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

// Subscribe to store changes to save to IndexedDB
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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 