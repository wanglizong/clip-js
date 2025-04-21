"use client";

import { MediaFile } from '../types';

interface MediaListProps {
    mediaFiles: MediaFile[];
    onUpdateMedia: (id: string, updates: Partial<MediaFile>) => void;
    onDeleteMedia: (id: string) => void;
}

export default function MediaList({ mediaFiles, onUpdateMedia, onDeleteMedia }: MediaListProps) {

    return (
        <div className="space-y-4">
            {mediaFiles.map((mediaFile) => (
                <div key={mediaFile.id} className="border p-4 rounded space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={mediaFile.includeInMerge}
                                onChange={() => onUpdateMedia(mediaFile.id, { includeInMerge: !mediaFile.includeInMerge })}
                                className="h-4 w-4"
                            />
                            <span className="flex-1">{mediaFile.file.name}</span>
                        </div>
                        <button
                            onClick={() => onDeleteMedia(mediaFile.id)}
                            className="text-red-500 hover:text-red-700"
                        >
                            Remove
                        </button>
                    </div>
                    {mediaFile.includeInMerge && (
                        <div className="grid grid-cols-2 gap-4">
                            {/* Source Video */}
                            <div className="space-y-2">
                                <h4 className="font-semibold">Source Video</h4>
                                <div className="flex items-center space-x-4">
                                    <div>
                                        <label className="block text-sm">Start (s)</label>
                                        <input
                                            type="number"
                                            value={mediaFile.startTime}
                                            min={0}
                                            onChange={(e) => onUpdateMedia(mediaFile.id, {
                                                startTime: Number(e.target.value),
                                                endTime: mediaFile.endTime
                                            })}
                                            className="border p-1 w-20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm">End (s)</label>
                                        <input
                                            type="number"
                                            value={mediaFile.endTime}
                                            min={mediaFile.startTime}
                                            onChange={(e) => onUpdateMedia(mediaFile.id, {
                                                startTime: mediaFile.startTime,
                                                endTime: Number(e.target.value)
                                            })}
                                            className="border p-1 w-20"
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Final Position */}
                            <div className="space-y-2">
                                <h4 className="font-semibold">Final Position</h4>
                                <div className="flex items-center space-x-4">
                                    <div>
                                        <label className="block text-sm">Start (s)</label>
                                        <input
                                            type="number"
                                            value={mediaFile.positionStart}
                                            min={0}
                                            onChange={(e) => onUpdateMedia(mediaFile.id, {
                                                positionStart: Number(e.target.value),
                                                positionEnd: Number(e.target.value) + (mediaFile.positionEnd - mediaFile.positionStart)
                                            })}
                                            className="border p-1 w-20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm">End (s)</label>
                                        <input
                                            type="number"
                                            value={mediaFile.positionEnd}
                                            min={mediaFile.positionStart}
                                            onChange={(e) => onUpdateMedia(mediaFile.id, {
                                                positionEnd: Number(e.target.value)
                                            })}
                                            className="border p-1 w-20"
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Visual Properties */}
                            <div className="space-y-2">
                                <h4 className="font-semibold">Visual Properties</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm">X Position</label>
                                        <input
                                            type="number"
                                            value={mediaFile.x || 0}
                                            onChange={(e) => onUpdateMedia(mediaFile.id, { x: Number(e.target.value) })}
                                            className="border p-1 w-20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm">Y Position</label>
                                        <input
                                            type="number"
                                            value={mediaFile.y || 0}
                                            onChange={(e) => onUpdateMedia(mediaFile.id, { y: Number(e.target.value) })}
                                            className="border p-1 w-20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm">Width</label>
                                        <input
                                            type="number"
                                            value={mediaFile.width || 100}
                                            onChange={(e) => onUpdateMedia(mediaFile.id, { width: Number(e.target.value) })}
                                            className="border p-1 w-20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm">Height</label>
                                        <input
                                            type="number"
                                            value={mediaFile.height || 100}
                                            onChange={(e) => onUpdateMedia(mediaFile.id, { height: Number(e.target.value) })}
                                            className="border p-1 w-20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm">Rotation</label>
                                        <input
                                            type="number"
                                            value={mediaFile.rotation || 0}
                                            onChange={(e) => onUpdateMedia(mediaFile.id, { rotation: Number(e.target.value) })}
                                            className="border p-1 w-20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm">Opacity</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={mediaFile.opacity || 1}
                                            onChange={(e) => onUpdateMedia(mediaFile.id, { opacity: Number(e.target.value) })}
                                            className="border p-1 w-20"
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Audio Properties */}
                            <div className="space-y-2">
                                <h4 className="font-semibold">Audio Properties</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm">Volume</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={mediaFile.volume || 1}
                                            onChange={(e) => onUpdateMedia(mediaFile.id, { volume: Number(e.target.value) })}
                                            className="border p-1 w-20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm">Playback Speed</label>
                                        <input
                                            type="number"
                                            min="0.1"
                                            max="4"
                                            step="0.1"
                                            value={mediaFile.playbackSpeed || 1}
                                            onChange={(e) => onUpdateMedia(mediaFile.id, { playbackSpeed: Number(e.target.value) })}
                                            className="border p-1 w-20"
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* zindex */}
                            <div className="space-y-2">
                                <h4 className="font-semibold">zindex</h4>
                                <div className="flex items-center space-x-4">
                                    <div>
                                        <label className="block text-sm">Start (s)</label>
                                        <input
                                            type="number"
                                            value={mediaFile.zIndex}
                                            min={0}
                                            onChange={(e) => onUpdateMedia(mediaFile.id, { zIndex: Number(e.target.value) })}
                                            className="border p-1 w-20"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
} 