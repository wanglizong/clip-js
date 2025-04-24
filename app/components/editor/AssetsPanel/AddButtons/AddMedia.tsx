"use client";

import { useAppDispatch, useAppSelector } from "../../../../store";
import { setMediaFiles } from "../../../../store/slices/projectSlice";
import { storeFile } from "../../../../store";
import { categorizeFile } from "../../../../utils/utils";
import Image from 'next/image';

export default function AddMedia() {
    const { mediaFiles } = useAppSelector((state) => state.projectState);
    const dispatch = useAppDispatch();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []);
        const updatedFiles = [...mediaFiles];

        for (const file of newFiles) {
            const fileId = crypto.randomUUID();

            await storeFile(file, fileId);
            if (fileId) {
                const lastEnd = mediaFiles.length > 0 ? Math.max(...mediaFiles.map(f => f.positionEnd)) : 0;
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
                    width: 1920,
                    height: 1080,
                    rotation: 0,
                    opacity: 1,
                    crop: { x: 0, y: 0, width: 1920, height: 1080 },
                    playbackSpeed: 1,
                    volume: 1,
                    type: categorizeFile(file.type),
                    zIndex: 0,
                });
            }
        }
        dispatch(setMediaFiles(updatedFiles));
    };

    return (
        <div
            className="rounded-full bg-white border border-solid border-transparent transition-colors flex flex-col items-center justify-center text-gray-800 hover:bg-[#ccc] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-auto py-2 px-2 sm:px-5 sm:w-auto"
        >
            <label
                htmlFor="file-upload"
                className="cursor-pointer rounded-full bg-white border border-solid border-transparent transition-colors flex flex-col items-center justify-center text-gray-800 hover:bg-[#ccc] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-auto py-2 px-2 sm:px-5 sm:w-auto"
            >
                <Image
                    alt="Add Project"
                    className="Black"
                    height={12}
                    width={12}
                    src="https://www.svgrepo.com/show/529274/upload.svg"
                />
                <span className="text-xs">Library</span>
            </label>
            <input
                type="file"
                accept="video/*,audio/*,image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
            />
        </div>
    );
}
