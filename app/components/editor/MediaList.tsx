"use client";

import { useAppSelector } from '../../store';
import { setMediaFiles } from '../../store/slices/projectSlice';
import { MediaFile } from '../../types';
import { useAppDispatch } from '../../store';
import Image from 'next/image';
// Video management functions
export default function MediaList() {
    const { mediaFiles } = useAppSelector((state) => state.projectState);
    const dispatch = useAppDispatch();
    const onUpdateMedia = (id: string, updates: Partial<MediaFile>) => {
        dispatch(setMediaFiles(mediaFiles.map(media =>
            media.id === id ? { ...media, ...updates } : media
        )));
    };

    const onDeleteMedia = (id: string) => {
        const index = mediaFiles.findIndex(f => f.id === id);
        const updatedFiles = mediaFiles.filter((_, i) => i !== index);
        dispatch(setMediaFiles(updatedFiles));
    };

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
                            <span className="py-2 px-2 text-sm flex-1">{mediaFile.file.name}</span>
                        </div>
                        <button
                            onClick={() => onDeleteMedia(mediaFile.id)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}