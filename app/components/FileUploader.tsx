"use client";

import { useState, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import CanvasVideoPreview from "./CanvasVideoPreview";
import { useAppDispatch } from "../store";
import { setVideoFiles } from "../store/slices/videoSlice";
import { storeFile, getFile, listFiles, deleteFile, loadState } from "../store";
import { categorizeFile } from "../utils/utils";
import { MediaFile as VideoFile } from "../types";

interface FileUploaderProps {
    onFilesChange: (files: VideoFile[]) => void;
    selectedFiles: VideoFile[];
    onPreviewChange: (url: string | null) => void;
    ffmpeg: FFmpeg;
}

export default function FileUploader({ onFilesChange, selectedFiles, onPreviewChange, ffmpeg }: FileUploaderProps) {
    const dispatch = useAppDispatch();
    const [files, setFiles] = useState<VideoFile[]>([]);
    const [isMerging, setIsMerging] = useState(false);
    const [storedFileIds, setStoredFileIds] = useState<string[]>([]);

    // Load stored files on component mount
    useEffect(() => {
        const loadStoredFiles = async () => {
            const storedFiles = await listFiles();
            const storedState = await loadState();
            const updatedFiles = [...files];
            for (const file of storedState?.video?.videoFiles || []) {
                const lastEnd = files.length > 0 ? Math.max(...files.map(f => f.positionEnd)) : 0;
                const fileData = await getFile(file.id);
                // Find the stored state for this file if it exists
                const storedFileState = storedState?.video?.videoFiles?.find(
                    (f: VideoFile) => f.file.name === file.file.name
                );

                updatedFiles.push({
                    id: file.id,
                    file: fileData,
                    startTime: file?.startTime ?? 0,
                    endTime: file?.endTime ?? 30,
                    positionStart: file?.positionStart ?? lastEnd,
                    positionEnd: file?.positionEnd ?? lastEnd + 30,
                    includeInMerge: file?.includeInMerge ?? true,
                    playbackSpeed: file?.playbackSpeed ?? 1,
                    volume: file?.volume ?? 1,
                    type: categorizeFile(fileData.type),
                    zIndex: file?.zIndex ?? 0,
                });
            }
            setFiles(updatedFiles);
            setStoredFileIds(storedFiles.map(file => file.id));
        };
        loadStoredFiles();
    }, []);

    // Update Redux state when files change
    useEffect(() => {
        dispatch(setVideoFiles(files.filter(f => f.includeInMerge)));
    }, [files, dispatch]);

    const mergeVideos = async (videoFiles: VideoFile[]) => {
        if (videoFiles.length === 0) {
            onPreviewChange(null);
            return;
        }

        setIsMerging(true);
        try {
            // Sort files by position start time
            const sortedFiles = [...videoFiles].sort((a, b) => a.positionStart - b.positionStart);

            // Clear any existing files in FFmpeg's virtual filesystem
            try {
                await ffmpeg.deleteFile('output.mp4');
                for (let i = 0; i < sortedFiles.length; i++) {
                    await ffmpeg.deleteFile(`input${i}.mp4`);
                    await ffmpeg.deleteFile(`trimmed${i}.mp4`);
                }
                await ffmpeg.deleteFile('filelist.txt');
            } catch (error) {
                // Ignore errors from deleting non-existent files
            }

            // Write all files to FFmpeg's virtual filesystem
            for (let i = 0; i < sortedFiles.length; i++) {
                const fileData = await fetchFile(sortedFiles[i].file);
                await ffmpeg.writeFile(`input${i}.mp4`, fileData);
            }

            // First, trim each video to its specified duration
            for (let i = 0; i < sortedFiles.length; i++) {
                const file = sortedFiles[i];
                const duration = file.endTime - file.startTime;

                // Trim video with copy codec for speed
                await ffmpeg.exec([
                    '-i', `input${i}.mp4`,
                    '-ss', file.startTime.toString(),
                    '-t', duration.toString(),
                    '-c', 'copy',
                    `trimmed${i}.mp4`
                ]);
            }

            // Create a file list for concatenation
            const trimmedFileList = sortedFiles.map((_, i) => `file 'trimmed${i}.mp4'`).join('\n');
            await ffmpeg.writeFile('filelist.txt', new TextEncoder().encode(trimmedFileList));

            // Concatenate the trimmed videos with copy codec
            await ffmpeg.exec([
                '-f', 'concat',
                '-safe', '0',
                '-i', 'filelist.txt',
                '-c', 'copy',
                'output.mp4'
            ]);

            // Read the merged file
            const data = await ffmpeg.readFile('output.mp4');
            const blob = new Blob([data as Uint8Array], { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);
            onPreviewChange(url);

            // Clean up temporary files
            try {
                for (let i = 0; i < sortedFiles.length; i++) {
                    await ffmpeg.deleteFile(`input${i}.mp4`);
                    await ffmpeg.deleteFile(`trimmed${i}.mp4`);
                }
                await ffmpeg.deleteFile('filelist.txt');
            } catch (error) {
                console.warn('Error cleaning up temporary files:', error);
            }
        } catch (error) {
            console.error('Error merging videos:', error);
            onPreviewChange(null);
        } finally {
            setIsMerging(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []);
        const updatedFiles = [...files];

        for (const file of newFiles) {
            // Store file in IndexedDB
            const fileId = crypto.randomUUID();

            await storeFile(file, fileId);
            if (fileId) {
                setStoredFileIds(prev => [...prev, fileId]);

                const lastEnd = files.length > 0 ? Math.max(...files.map(f => f.positionEnd)) : 0;
                updatedFiles.push({
                    id: fileId,
                    file,
                    startTime: 0,
                    endTime: 30, // Default 5 seconds
                    positionStart: lastEnd, // Start after the last video
                    positionEnd: lastEnd + 30, // Default 5 seconds duration
                    includeInMerge: true,
                    playbackSpeed: 1,// Default playback speed
                    volume: 1,
                    type: categorizeFile(file.type),
                    zIndex: 0,
                });
            }
        }

        setFiles(updatedFiles);
        onFilesChange(updatedFiles);
    };

    const removeFile = async (index: number) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        const fileId = storedFileIds[index];
        if (fileId) {
            await deleteFile(fileId);
            setStoredFileIds(prev => prev.filter(id => id !== fileId));
        }
        setFiles(updatedFiles);
        onFilesChange(updatedFiles);
    };

    const updateFileTiming = async (index: number, startTime: number, endTime: number) => {
        const updatedFiles = [...files];
        updatedFiles[index] = {
            ...updatedFiles[index],
            startTime,
            endTime
        };
        setFiles(updatedFiles);
        onFilesChange(updatedFiles);
    };

    const toggleFileMerge = async (index: number) => {
        const updatedFiles = [...files];
        updatedFiles[index] = {
            ...updatedFiles[index],
            includeInMerge: !updatedFiles[index].includeInMerge
        };
        setFiles(updatedFiles);
        onFilesChange(updatedFiles);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <input
                    type="file"
                    accept="video/*,audio/*,image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                />
                <label
                    htmlFor="file-upload"
                    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded cursor-pointer"
                >
                    Add Files
                </label>
                <button
                    onClick={() => mergeVideos(files.filter(f => f.includeInMerge))}
                    className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
                    disabled={isMerging}
                >
                    {isMerging ? 'Merging...' : 'Merge Videos'}
                </button>
                {isMerging && (
                    <span className="animate-spin">
                        <svg
                            viewBox="0 0 1024 1024"
                            focusable="false"
                            data-icon="loading"
                            width="1em"
                            height="1em"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path>
                        </svg>
                    </span>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Canvas Preview</h3>
                    {files.length > 0 && (
                        <CanvasVideoPreview
                            videoFiles={files.filter(f => f.includeInMerge)}
                        />
                    )}
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2">Merged Result</h3>
                    {selectedFiles.length > 0 && (
                        <video
                            src={selectedFiles[0].file.name}
                            controls
                            className="w-full"
                        />
                    )}
                </div>
            </div>

            <div className="space-y-4">
                {files.map((videoFile, index) => (
                    <div key={index} className="border p-4 rounded space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={videoFile.includeInMerge}
                                    onChange={() => toggleFileMerge(index)}
                                    className="h-4 w-4"
                                />
                                <span className="flex-1">{videoFile.file.name}</span>
                            </div>
                            <button
                                onClick={() => removeFile(index)}
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
                                                onChange={(e) => updateFileTiming(index, Number(e.target.value), videoFile.endTime)}
                                                className="border p-1 w-20"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm">End (s)</label>
                                            <input
                                                type="number"
                                                value={videoFile.endTime}
                                                min={videoFile.startTime}
                                                onChange={(e) => updateFileTiming(index, videoFile.startTime, Number(e.target.value))}
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
                                                onChange={(e) => {
                                                    const updatedFiles = [...files];
                                                    updatedFiles[index] = {
                                                        ...updatedFiles[index],
                                                        positionStart: Number(e.target.value),
                                                        positionEnd: Number(e.target.value) + (videoFile.positionEnd - videoFile.positionStart)
                                                    };
                                                    setFiles(updatedFiles);
                                                    onFilesChange(updatedFiles);
                                                }}
                                                className="border p-1 w-20"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm">End (s)</label>
                                            <input
                                                type="number"
                                                value={videoFile.positionEnd}
                                                min={videoFile.positionStart}
                                                onChange={(e) => {
                                                    const updatedFiles = [...files];
                                                    updatedFiles[index] = {
                                                        ...updatedFiles[index],
                                                        positionEnd: Number(e.target.value)
                                                    };
                                                    setFiles(updatedFiles);
                                                    onFilesChange(updatedFiles);
                                                }}
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
                                                onChange={(e) => {
                                                    const updatedFiles = [...files];
                                                    updatedFiles[index] = {
                                                        ...updatedFiles[index],
                                                        zIndex: Number(e.target.value),
                                                    };
                                                    setFiles(updatedFiles);
                                                    onFilesChange(updatedFiles);
                                                }}
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
        </div>
    );
} 