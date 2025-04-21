'use client'
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { MediaFile } from "../types";
import { useState } from "react";
import { fetchFile } from "@ffmpeg/util";

interface FileUploaderProps {
    onFilesChange: (files: MediaFile[]) => void;
    selectedFiles: MediaFile[];
    onPreviewChange: (url: string | null) => void;
    ffmpeg: FFmpeg;
}

export default function FfmpegRender({ onFilesChange, selectedFiles, onPreviewChange, ffmpeg }: FileUploaderProps) {
    const [isMerging, setIsMerging] = useState(false);

    const mergeVideos = async (videoFiles: MediaFile[], onPreviewChange: (url: string | null) => void, ffmpeg: FFmpeg) => {
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

    return (
        <>
            <button
                onClick={() => mergeVideos(files.filter(f => f.includeInMerge))}
                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
                disabled={isMerging}
            >
                {isMerging ? 'Merging...' : 'Merge Videos'}
            </button>
            {
                isMerging && (
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
                )
            }
        </>
    )
}