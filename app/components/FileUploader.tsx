"use client";

import { useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

interface VideoFile {
    file: File;
    startTime: number;
    endTime: number;
}

interface FileUploaderProps {
    onFilesChange: (files: VideoFile[]) => void;
    selectedFiles: VideoFile[];
    onPreviewChange: (url: string | null) => void;
    ffmpeg: FFmpeg;
}

export default function FileUploader({ onFilesChange, selectedFiles, onPreviewChange, ffmpeg }: FileUploaderProps) {
    const [files, setFiles] = useState<VideoFile[]>([]);
    const [isMerging, setIsMerging] = useState(false);

    const mergeVideos = async (videoFiles: VideoFile[]) => {
        if (videoFiles.length === 0) {
            onPreviewChange(null);
            return;
        }

        setIsMerging(true);
        try {
            // Sort files by start time
            const sortedFiles = [...videoFiles].sort((a, b) => a.startTime - b.startTime);

            // Clear any existing files in FFmpeg's virtual filesystem
            try {
                await ffmpeg.deleteFile('output.mp4');
                for (let i = 0; i < sortedFiles.length; i++) {
                    await ffmpeg.deleteFile(`input${i}.mp4`);
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

            // Create a file list for concatenation
            const fileList = sortedFiles.map((_, i) => `file 'input${i}.mp4'`).join('\n');
            await ffmpeg.writeFile('filelist.txt', fileList);

            // First, trim each video to its specified duration
            for (let i = 0; i < sortedFiles.length; i++) {
                const file = sortedFiles[i];
                const duration = file.endTime - file.startTime;

                await ffmpeg.exec([
                    '-i', `input${i}.mp4`,
                    '-ss', file.startTime.toString(),
                    '-t', duration.toString(),
                    '-c', 'copy',
                    `trimmed${i}.mp4`
                ]);
            }

            // Then concatenate the trimmed videos
            const trimmedFileList = sortedFiles.map((_, i) => `file 'trimmed${i}.mp4'`).join('\n');
            await ffmpeg.writeFile('trimmedlist.txt', trimmedFileList);

            await ffmpeg.exec([
                '-f', 'concat',
                '-safe', '0',
                '-i', 'trimmedlist.txt',
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
                    await ffmpeg.deleteFile(`trimmed${i}.mp4`);
                }
                await ffmpeg.deleteFile('trimmedlist.txt');
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
        const updatedFiles = [
            ...files,
            ...newFiles.map(file => ({
                file,
                startTime: 0,
                endTime: 5 // Default 5 seconds
            }))
        ];
        setFiles(updatedFiles);
        onFilesChange(updatedFiles);
        await mergeVideos(updatedFiles);
    };

    const removeFile = async (index: number) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        onFilesChange(updatedFiles);
        await mergeVideos(updatedFiles);
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
        await mergeVideos(updatedFiles);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <input
                    type="file"
                    accept="video/*"
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

            <div className="space-y-4">
                {files.map((videoFile, index) => (
                    <div key={index} className="border p-4 rounded space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="flex-1">{videoFile.file.name}</span>
                            <button
                                onClick={() => removeFile(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                Remove
                            </button>
                        </div>
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
                ))}
            </div>
        </div>
    );
} 