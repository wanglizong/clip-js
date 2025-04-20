import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VideoFile } from '../../components/FileUploader';

interface VideoState {
    videoFiles: VideoFile[];
    currentTime: number;
    isPlaying: boolean;
    isMuted: boolean;
    duration: number;
    playbackSpeeds: number[];
}

const initialState: VideoState = {
    videoFiles: [],
    currentTime: 0,
    isPlaying: false,
    isMuted: false,
    duration: 0,
    playbackSpeeds: [],
};

const videoSlice = createSlice({
    name: 'video',
    initialState,
    reducers: {
        setVideoFiles: (state, action: PayloadAction<VideoFile[]>) => {
            state.videoFiles = action.payload;
            // Calculate duration based on the last video's end time
            if (action.payload.length > 0) {
                state.duration = Math.max(...action.payload.map(v => v.positionEnd));
            }
            // Initialize playback speeds
            state.playbackSpeeds = action.payload.map(() => 1);
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
        setPlaybackSpeed: (state, action: PayloadAction<{ index: number; speed: number }>) => {
            const { index, speed } = action.payload;
            state.playbackSpeeds[index] = speed;
        },
        // Special reducer for rehydrating state from IndexedDB
        rehydrate: (state, action: PayloadAction<VideoState>) => {
            return { ...state, ...action.payload };
        },
    },
});

export const {
    setVideoFiles,
    setCurrentTime,
    setIsPlaying,
    setIsMuted,
    setPlaybackSpeed,
} = videoSlice.actions;

export default videoSlice.reducer; 