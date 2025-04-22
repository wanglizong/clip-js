import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TextElement, MediaFile } from '../../types';
import { ProjectState } from '../../types';

export const initialState: ProjectState = {
    id: '',
    projectName: '',
    createdAt: '',
    lastModified: '',
    mediaFiles: [],
    textElements: [],
    currentTime: 0,
    isPlaying: false,
    isMuted: false,
    duration: 0,
    zoomLevel: 1,
    resolution: { width: 1920, height: 1080 },
    fps: 30,
    aspectRatio: '16:9',
    history: [],
    future: [],
    exportSettings: {
        resolution: { width: 1920, height: 1080 },
        fps: 30,
        format: 'mp4',
        quality: 100,
        audioEnabled: true,
        includeSubtitles: false,
        filename: '',
    },
};

const projectStateSlice = createSlice({
    name: 'projectState',
    initialState,
    reducers: {
        setMediaFiles: (state, action: PayloadAction<MediaFile[]>) => {
            state.mediaFiles = action.payload;
            // Calculate duration based on the last video's end time
            if (action.payload.length > 0) {
                state.duration = Math.max(...action.payload.map(v => v.positionEnd));
            }
        },
        setTextElements: (state, action: PayloadAction<TextElement[]>) => {
            state.textElements = action.payload;
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
        rehydrate: (state, action: PayloadAction<ProjectState>) => {
            return { ...state, ...action.payload };
        },
        createNewProject: (state, action: PayloadAction<ProjectState>) => {
            return { ...action.payload };
        },
    },
});

export const {
    setMediaFiles,
    setTextElements,
    setCurrentTime,
    setIsPlaying,
    setIsMuted,
    rehydrate,
    createNewProject,
} = projectStateSlice.actions;

export default projectStateSlice.reducer; 