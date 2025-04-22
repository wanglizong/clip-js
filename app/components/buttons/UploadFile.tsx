
import { useAppDispatch, useAppSelector } from "../../store";
import { setMediaFiles } from "../../store/slices/projectSlice";
import { storeFile } from "../../store";
import { categorizeFile } from "../../utils/utils";
export default function UploadFile() {
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
        dispatch(setMediaFiles(updatedFiles));
    };

    return (
        <div>
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
            </div>
        </div>
    );
}
