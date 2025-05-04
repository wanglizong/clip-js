"use client";

import { useAppSelector } from '../../../store';
import { setActiveElement, setMediaFiles, setTextElements } from '../../../store/slices/projectSlice';
import { MediaFile } from '../../../types';
import { useAppDispatch } from '../../../store';

export default function MediaProperties() {
    const { mediaFiles, activeElementIndex } = useAppSelector((state) => state.projectState);
    const mediaFile = mediaFiles[activeElementIndex];
    const dispatch = useAppDispatch();
    const onUpdateMedia = (id: string, updates: Partial<MediaFile>) => {
        dispatch(setMediaFiles(mediaFiles.map(media =>
            media.id === id ? { ...media, ...updates } : media
        )));
    };

    const onDeleteMedia = (id: string) => {
        if (mediaFiles[activeElementIndex].id === id) {
            dispatch(setActiveElement(null));
        }
        const index = mediaFiles.findIndex(f => f.id === id);
        const updatedFiles = mediaFiles.filter((_, i) => i !== index);
        dispatch(setMediaFiles(updatedFiles));
    };

    if (!mediaFile) return null;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-8">
                {/* Source Video */}
                <div className="space-y-2">
                    <h4 className="font-semibold">Source Video</h4>
                    <div className="flex items-center space-x-4">
                        <div>
                            <label className="block text-sm">Start (s)</label>
                            <input
                                type="number"
                                readOnly={true}
                                value={mediaFile.startTime}
                                min={0}
                                onChange={(e) => onUpdateMedia(mediaFile.id, {
                                    startTime: Number(e.target.value),
                                    endTime: mediaFile.endTime
                                })}
                                className="w-full p-2 bg-darkSurfacePrimary border border-white border-opacity-10 shadow-md text-white rounded focus:outline-none focus:ring-2 focus:ring-white-500 focus:border-white-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm">End (s)</label>
                            <input
                                type="number"
                                readOnly={true}
                                value={mediaFile.endTime}
                                min={mediaFile.startTime}
                                onChange={(e) => onUpdateMedia(mediaFile.id, {
                                    startTime: mediaFile.startTime,
                                    endTime: Number(e.target.value)
                                })}
                                className="w-full p-2 bg-darkSurfacePrimary border border-white border-opacity-10 shadow-md text-white rounded focus:outline-none focus:ring-2 focus:ring-white-500 focus:border-white-500"
                            />
                        </div>
                    </div>
                </div>
                {/* Timing Position */}
                <div className="space-y-2">
                    <h4 className="font-semibold">Timing Position</h4>
                    <div className="flex items-center space-x-4">
                        <div>
                            <label className="block text-sm">Start (s)</label>
                            <input
                                type="number"
                                readOnly={true}
                                value={mediaFile.positionStart}
                                min={0}
                                onChange={(e) => onUpdateMedia(mediaFile.id, {
                                    positionStart: Number(e.target.value),
                                    positionEnd: Number(e.target.value) + (mediaFile.positionEnd - mediaFile.positionStart)
                                })}
                                className="w-full p-2 bg-darkSurfacePrimary border border-white border-opacity-10 shadow-md text-white rounded focus:outline-none focus:ring-2 focus:ring-white-500 focus:border-white-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm">End (s)</label>
                            <input
                                type="number"
                                readOnly={true}
                                value={mediaFile.positionEnd}
                                min={mediaFile.positionStart}
                                onChange={(e) => onUpdateMedia(mediaFile.id, {
                                    positionEnd: Number(e.target.value)
                                })}
                                className="w-full p-2 bg-darkSurfacePrimary border border-white border-opacity-10 shadow-md text-white rounded focus:outline-none focus:ring-2 focus:ring-white-500 focus:border-white-500"
                            />
                        </div>
                    </div>
                </div>
                {/* Visual Properties */}
                <div className="space-y-6">
                    <h4 className="font-semibold">Visual Properties</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm">X Position</label>
                            <input
                                type="number"
                                step="10"
                                value={mediaFile.x || 0}
                                onChange={(e) => onUpdateMedia(mediaFile.id, { x: Number(e.target.value) })}
                                className="w-full p-2 bg-darkSurfacePrimary border border-white border-opacity-10 shadow-md text-white rounded focus:outline-none focus:ring-2 focus:ring-white-500 focus:border-white-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm">Y Position</label>
                            <input
                                type="number"
                                step="10"
                                value={mediaFile.y || 0}
                                onChange={(e) => onUpdateMedia(mediaFile.id, { y: Number(e.target.value) })}
                                className="w-full p-2 bg-darkSurfacePrimary border border-white border-opacity-10 shadow-md text-white rounded focus:outline-none focus:ring-2 focus:ring-white-500 focus:border-white-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm">Width</label>
                            <input
                                type="number"
                                step="10"
                                value={mediaFile.width || 100}
                                onChange={(e) => onUpdateMedia(mediaFile.id, { width: Number(e.target.value) })}
                                className="w-full p-2 bg-darkSurfacePrimary border border-white border-opacity-10 shadow-md text-white rounded focus:outline-none focus:ring-2 focus:ring-white-500 focus:border-white-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm">Height</label>
                            <input
                                type="number"
                                step="10"
                                value={mediaFile.height || 100}
                                onChange={(e) => onUpdateMedia(mediaFile.id, { height: Number(e.target.value) })}
                                className="w-full p-2 bg-darkSurfacePrimary border border-white border-opacity-10 shadow-md text-white rounded focus:outline-none focus:ring-2 focus:ring-white-500 focus:border-white-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm">Zindex</label>
                            <input
                                type="number"
                                value={mediaFile.zIndex || 0}
                                onChange={(e) => onUpdateMedia(mediaFile.id, { zIndex: Number(e.target.value) })}
                                className="w-full p-2 bg-darkSurfacePrimary border border-white border-opacity-10 shadow-md text-white rounded focus:outline-none focus:ring-2 focus:ring-white-500 focus:border-white-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm">Opacity</label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={mediaFile.opacity}
                                onChange={(e) => onUpdateMedia(mediaFile.id, { opacity: Number(e.target.value) })}
                                className="w-full bg-darkSurfacePrimary border border-white border-opacity-10 shadow-md text-white rounded focus:outline-none focus:border-white-500"
                            />
                        </div>
                    </div>
                    <button
                        onClick={() => onDeleteMedia(mediaFile.id)}
                        className="text-red-500 hover:text-red-700 flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>Remove Media</span>
                    </button>
                </div>
                {/* Audio Properties */}
                {(mediaFile.type === "video" || mediaFile.type === "audio") && <div className="space-y-2">
                    <h4 className="font-semibold">Audio Properties</h4>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm mb-2 text-white">Volume</label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="1"
                                value={mediaFile.volume}
                                onChange={(e) => onUpdateMedia(mediaFile.id, { volume: Number(e.target.value) })}
                                className="w-full bg-darkSurfacePrimary border border-white border-opacity-10 shadow-md text-white rounded focus:outline-none focus:border-white-500"
                            />
                        </div>
                        {/* TODO: Add playback speed */}
                        {/* <div>
                            <label className="block text-sm">Speed</label>
                            <input
                                type="number"
                                min="0.1"
                                max="4"
                                step="0.1"
                                value={mediaFile.playbackSpeed || 1}
                                onChange={(e) => onUpdateMedia(mediaFile.id, { playbackSpeed: Number(e.target.value) })}
                                className="w-full p-2 bg-darkSurfacePrimary border border-white border-opacity-10 shadow-md text-white rounded focus:outline-none focus:ring-2 focus:ring-white-500 focus:border-white-500"
                            />
                        </div> */}
                    </div>
                </div>}
                <div >
                </div>
            </div>
        </div >
    );
}