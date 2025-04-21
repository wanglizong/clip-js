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
import VideoList from './VideoList';

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

    // File related functions
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


    // Text related functions
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

    // Video management functions
    const handleUpdateVideo = (id: string, updates: Partial<VideoFile>) => {
        setFiles(prev => prev.map(video =>
            video.id === id ? { ...video, ...updates } : video
        ));
    };

    const handleDeleteVideo = (id: string) => {
        const index = files.findIndex(f => f.id === id);
        if (index !== -1) {
            removeFile(index);
        }
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
            {/* file List */}
            <VideoList
                videoFiles={files}
                onUpdateVideo={handleUpdateVideo}
                onDeleteVideo={handleDeleteVideo}
            />
            {/* Text List */}
            <TextList
                textElements={textElements}
                onUpdateText={handleUpdateText}
                onDeleteText={handleDeleteText}
            />
        </div>
    );
} 