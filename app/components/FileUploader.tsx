"use client";

import { useState, useEffect } from "react";
import CanvasVideoPreview from "./CanvasVideoPreview";
import { useAppDispatch } from "../store";
import { setVideoFiles } from "../store/slices/videoSlice";
import { storeFile, getFile, listFiles, deleteFile, loadState } from "../store";
import { categorizeFile } from "../utils/utils";
import { MediaFile as VideoFile, TextElement } from "../types";
import AddTextButton from './AddTextButton';
import TextList from './TextList';
interface FileUploaderProps {
    onFilesChange: (files: VideoFile[]) => void;
    selectedFiles: VideoFile[];
    onPreviewChange: (url: string | null) => void;
}
export default function FileUploader({ onFilesChange, selectedFiles, onPreviewChange }: FileUploaderProps) {
    const dispatch = useAppDispatch();
    const [files, setFiles] = useState<VideoFile[]>([]);
    const [storedFileIds, setStoredFileIds] = useState<string[]>([]);
    const [textElements, setTextElements] = useState<TextElement[]>([]);

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

    const handleAddText = (textElement: TextElement) => {
        setTextElements(prev => [...prev, textElement]);
    };

    const handleUpdateText = (id: string, updates: Partial<TextElement>) => {
        setTextElements(prev => prev.map(text =>
            text.id === id ? { ...text, ...updates } : text
        ));
    };

    const handleDeleteText = (id: string) => {
        setTextElements(prev => prev.filter(text => text.id !== id));
    };

    return (

        <div className="space-y-4">
            {/* Button and Text Input */}
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
                <AddTextButton onAddText={handleAddText} />
            </div>
            {/* Canvas Preview */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Canvas Preview</h3>
                    {files.length > 0 && (
                        <CanvasVideoPreview
                            videoFiles={files.filter(f => f.includeInMerge)}
                            textElements={textElements}
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
            <TextList
                textElements={textElements}
                onUpdateText={handleUpdateText}
                onDeleteText={handleDeleteText}
            />
            {/* File List */}
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