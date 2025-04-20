import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SoundFile } from '../../components/FileUploader';

interface SoundState {
    soundFiles: SoundFile[];
    currentTime: number;
    isPlaying: boolean;
    isMuted: boolean;
}

const initialState: SoundState = {
    soundFiles: [],
    currentTime: 0,
    isPlaying: false,
    isMuted: false,
};

const soundSlice = createSlice({
    name: 'sound',
    initialState,
    reducers: {
        setSoundFiles: (state, action: PayloadAction<SoundFile[]>) => {
            state.soundFiles = action.payload;
        },
        setCurrentTime: (state, action: PayloadAction<number>) => {
            state.currentTime = action.payload;
        },
        setIsPlaying: (state, action: PayloadAction<boolean>) => {
            state.isPlaying = action.payload;
        },
        setIsMuted: (state, action: PayloadAction<boolean>) => {
            state.isMuted = action.payload;
        },
        // Special reducer for rehydrating state from IndexedDB
        rehydrate: (state, action: PayloadAction<SoundState>) => {
            return { ...state, ...action.payload };
        },
    },
});

export const { setSoundFiles, setCurrentTime, setIsPlaying, setIsMuted } = soundSlice.actions;
export default soundSlice.reducer; 