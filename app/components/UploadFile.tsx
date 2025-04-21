export default function UploadFile({ handleFileChange }: { handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
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
