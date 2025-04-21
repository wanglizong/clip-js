"use client";

import { useState, useEffect } from "react";
import CanvasVideoPreview from "./CanvasVideoPreview";
import { useAppDispatch } from "../store";
import { setMediaFiles, setTextElements as setTextElementsAction } from "../store/slices/projectSlice";
import { storeFile, getFile, deleteFile, loadState } from "../store";
import { categorizeFile } from "../utils/utils";
import { MediaFile, TextElement } from "../types";
import AddTextButton from './AddTextButton';
import UploadFile from './UploadFile';
import TextList from './TextList';
import MediaList from './MediaList';

interface FileUploaderProps {
    onFilesChange: (files: MediaFile[]) => void;
    selectedFiles: MediaFile[];
    onPreviewChange: (url: string | null) => void;
}

export default function FileUploader({ onFilesChange, selectedFiles, onPreviewChange }: FileUploaderProps) {
    const dispatch = useAppDispatch();
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [textElements, setTextElements] = useState<TextElement[]>([]);

    // Load stored elements on component mount
    useEffect(() => {
        const loadStoredFiles = async () => {
            const storedState = await loadState();
            const loadedFiles = [...files];
            // Load stored files
            for (const file of storedState?.projectState?.mediaFiles || []) {
                const lastEnd = files.length > 0 ? Math.max(...files.map(f => f.positionEnd)) : 0;
                const storedFileData = await getFile(file.id);

                loadedFiles.push({
                    id: file.id,
                    file: storedFileData,
                    startTime: file?.startTime ?? 0,
                    endTime: file?.endTime ?? 30,
                    positionStart: file?.positionStart ?? lastEnd,
                    positionEnd: file?.positionEnd ?? lastEnd + 30,
                    includeInMerge: file?.includeInMerge ?? true,
                    x: file?.x ?? 0,
                    y: file?.y ?? 0,
                    width: file?.width ?? 100,
                    height: file?.height ?? 100,
                    rotation: file?.rotation ?? 0,
                    opacity: file?.opacity ?? 1,
                    crop: file?.crop ?? { x: 0, y: 0, width: 100, height: 100 },
                    playbackSpeed: file?.playbackSpeed ?? 1,
                    volume: file?.volume ?? 1,
                    type: categorizeFile(storedFileData.type),
                    zIndex: file?.zIndex ?? 0,
                });
            }
            setFiles(loadedFiles);

            // Load stored text elements
            const loadedTextElements = [...textElements];
            for (const textElement of storedState?.projectState?.textElements || []) {
                const lastEnd = files.length > 0 ? Math.max(...files.map(f => f.positionEnd)) : 0;

                loadedTextElements.push({
                    id: textElement.id,
                    text: textElement.text,
                    positionStart: textElement?.positionStart ?? lastEnd,
                    positionEnd: textElement?.positionEnd ?? lastEnd + 30,
                    includeInMerge: textElement?.includeInMerge ?? true,
                    x: textElement?.x ?? 0,
                    y: textElement?.y ?? 0,
                    width: textElement?.width ?? 100,
                    height: textElement?.height ?? 100,
                    rotation: textElement?.rotation ?? 0,
                    opacity: textElement?.opacity ?? 1,
                    zIndex: textElement?.zIndex ?? 0,
                });
            }
            setTextElements(loadedTextElements);
        };

        loadStoredFiles();
    }, []);

    // Update Redux state when files change
    useEffect(() => {
        dispatch(setMediaFiles(files.filter(f => f.includeInMerge)));
        dispatch(setTextElementsAction(textElements));
    }, [files, textElements, dispatch]);

    // File related functions
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []);
        const updatedFiles = [...files];

        for (const file of newFiles) {
            // Store file in IndexedDB
            const fileId = crypto.randomUUID();

            await storeFile(file, fileId);
            if (fileId) {
                const lastEnd = files.length > 0 ? Math.max(...files.map(f => f.positionEnd)) : 0;
                updatedFiles.push({
                    id: fileId,
                    file,
                    startTime: 0,
                    endTime: 30,
                    positionStart: lastEnd,
                    positionEnd: lastEnd + 30,
                    includeInMerge: true,
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100,
                    rotation: 0,
                    opacity: 1,
                    crop: { x: 0, y: 0, width: 100, height: 100 },
                    playbackSpeed: 1,
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
        const fileId = files[index].id;
        if (fileId) {
            await deleteFile(fileId);
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
    const handleUpdateMedia = (id: string, updates: Partial<MediaFile>) => {
        setFiles(prev => prev.map(media =>
            media.id === id ? { ...media, ...updates } : media
        ));
    };

    const handleDeleteMedia = (id: string) => {
        const index = files.findIndex(f => f.id === id);
        if (index !== -1) {
            removeFile(index);
        }
    };

    return (
        <div className="space-y-4">
            {/* Upload file and Add Text */}
            <div className="flex items-center space-x-2">
                <UploadFile handleFileChange={handleFileChange} />
                <AddTextButton onAddText={handleAddText} />
            </div>
            {/* Canvas Preview */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Canvas Preview</h3>
                    {files.length > 0 && (
                        <CanvasVideoPreview
                            mediaFiles={files.filter(f => f.includeInMerge)}
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
            <MediaList
                mediaFiles={files}
                onUpdateMedia={handleUpdateMedia}
                onDeleteMedia={handleDeleteMedia}
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