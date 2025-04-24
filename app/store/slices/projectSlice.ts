import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TextElement, MediaFile, ActiveElement } from '../../types';
import { ProjectState } from '../../types';

export const initialState: ProjectState = {
    id: crypto.randomUUID(),
    projectName: '',
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    mediaFiles: [],
    textElements: [],
    currentTime: 0,
    isPlaying: false,
    isMuted: false,
    duration: 0,
    zoomLevel: 1,
    activeSection: 'media',
    activeElement: null,
    activeElementIndex: 0,
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
                state.duration = Math.max(...action.payload.map(v => v.positionEnd / v.playbackSpeed));
            }
        },
        setProjectName: (state, action: PayloadAction<string>) => {
            state.projectName = action.payload;
        },
        setProjectId: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        setProjectCreatedAt: (state, action: PayloadAction<string>) => {
            state.createdAt = action.payload;
        },
        setProjectLastModified: (state, action: PayloadAction<string>) => {
            state.lastModified = action.payload;
        },

        setTextElements: (state, action: PayloadAction<TextElement[]>) => {
            state.textElements = action.payload;
            if (action.payload.length > 0) {
                state.duration = Math.max(...action.payload.map(v => v.positionEnd));
            }
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
        setActiveSection: (state, action: PayloadAction<ActiveElement>) => {
            state.activeSection = action.payload;
        },
        setActiveElement: (state, action: PayloadAction<ActiveElement | null>) => {
            state.activeElement = action.payload;
        },
        setActiveElementIndex: (state, action: PayloadAction<number>) => {
            state.activeElementIndex = action.payload;
        },
        // Special reducer for rehydrating state from IndexedDB
        rehydrate: (state, action: PayloadAction<ProjectState>) => {
            return { ...state, ...action.payload };
        },
        createNewProject: (state) => {
            return { ...initialState };
        },
    },
});

export const {
    setMediaFiles,
    setTextElements,
    setCurrentTime,
    setProjectName,
    setIsPlaying,
    setIsMuted,
    setActiveSection,
    setActiveElement,
    setActiveElementIndex,
    rehydrate,
    createNewProject,
} = projectStateSlice.actions;

export default projectStateSlice.reducer; 