"use client";

import { MediaFile } from '../types';

interface VideoListProps {
    videoFiles: MediaFile[];
    onUpdateVideo: (id: string, updates: Partial<MediaFile>) => void;
    onDeleteVideo: (id: string) => void;
}

export default function VideoList({ videoFiles, onUpdateVideo, onDeleteVideo }: VideoListProps) {

    return (
        <div className="space-y-4">
            {videoFiles.map((videoFile) => (
                <div key={videoFile.id} className="border p-4 rounded space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={videoFile.includeInMerge}
                                onChange={() => onUpdateVideo(videoFile.id, { includeInMerge: !videoFile.includeInMerge })}
                                className="h-4 w-4"
                            />
                            <span className="flex-1">{videoFile.file.name}</span>
                        </div>
                        <button
                            onClick={() => onDeleteVideo(videoFile.id)}
                            className="text-red-500 hover:text-red-700"
                        >
                            Remove
                        </button>
                    </div>
                    {videoFile.includeInMerge && (
                        <div className="grid grid-cols-2 gap-4">
                            {/* Source Video */}
                            <div className="space-y-2">
                                <h4 className="font-semibold">Source Video</h4>
                                <div className="flex items-center space-x-4">
                                    <div>
                                        <label className="block text-sm">Start (s)</label>
                                        <input
                                            type="number"
                                            value={videoFile.startTime}
                                            min={0}
                                            onChange={(e) => onUpdateVideo(videoFile.id, {
                                                startTime: Number(e.target.value),
                                                endTime: videoFile.endTime
                                            })}
                                            className="border p-1 w-20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm">End (s)</label>
                                        <input
                                            type="number"
                                            value={videoFile.endTime}
                                            min={videoFile.startTime}
                                            onChange={(e) => onUpdateVideo(videoFile.id, {
                                                startTime: videoFile.startTime,
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
                                            value={videoFile.positionStart}
                                            min={0}
                                            onChange={(e) => onUpdateVideo(videoFile.id, {
                                                positionStart: Number(e.target.value),
                                                positionEnd: Number(e.target.value) + (videoFile.positionEnd - videoFile.positionStart)
                                            })}
                                            className="border p-1 w-20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm">End (s)</label>
                                        <input
                                            type="number"
                                            value={videoFile.positionEnd}
                                            min={videoFile.positionStart}
                                            onChange={(e) => onUpdateVideo(videoFile.id, {
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
                                            value={videoFile.x || 0}
                                            onChange={(e) => onUpdateVideo(videoFile.id, { x: Number(e.target.value) })}
                                            className="border p-1 w-20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm">Y Position</label>
                                        <input
                                            type="number"
                                            value={videoFile.y || 0}
                                            onChange={(e) => onUpdateVideo(videoFile.id, { y: Number(e.target.value) })}
                                            className="border p-1 w-20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm">Width</label>
                                        <input
                                            type="number"
                                            value={videoFile.width || 100}
                                            onChange={(e) => onUpdateVideo(videoFile.id, { width: Number(e.target.value) })}
                                            className="border p-1 w-20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm">Height</label>
                                        <input
                                            type="number"
                                            value={videoFile.height || 100}
                                            onChange={(e) => onUpdateVideo(videoFile.id, { height: Number(e.target.value) })}
                                            className="border p-1 w-20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm">Rotation</label>
                                        <input
                                            type="number"
                                            value={videoFile.rotation || 0}
                                            onChange={(e) => onUpdateVideo(videoFile.id, { rotation: Number(e.target.value) })}
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
                                            value={videoFile.opacity || 1}
                                            onChange={(e) => onUpdateVideo(videoFile.id, { opacity: Number(e.target.value) })}
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
                                            value={videoFile.volume || 1}
                                            onChange={(e) => onUpdateVideo(videoFile.id, { volume: Number(e.target.value) })}
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
                                            value={videoFile.playbackSpeed || 1}
                                            onChange={(e) => onUpdateVideo(videoFile.id, { playbackSpeed: Number(e.target.value) })}
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
                                            value={videoFile.zIndex}
                                            min={0}
                                            onChange={(e) => onUpdateVideo(videoFile.id, { zIndex: Number(e.target.value) })}
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