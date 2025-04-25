import { useAppSelector } from "@/app/store";
import { setActiveElement, setActiveElementIndex } from "@/app/store/slices/projectSlice";
import { memo, useEffect } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import Header from "./Header";
import VideoTimeline from "./elements-timeline/VideoTimeline";

export const Timeline = () => {
    const { mediaFiles, textElements, activeElement, activeElementIndex, currentTime } = useAppSelector((state) => state.projectState);

    const dispatch = useDispatch();
    const handleClick = (element: string, index: number | string) => {
        if (element === 'media') {
            dispatch(setActiveElement('media') as any);
            // TODO: cause we pass id when media to find the right index i will change this later (this happens cause each timeline pass its index not index from mediaFiles array)
            const actualIndex = mediaFiles.findIndex(clip => clip.id === index as unknown as string);
            dispatch(setActiveElementIndex(actualIndex));
        } else if (element === 'text') {
            dispatch(setActiveElement('text') as any);
            dispatch(setActiveElementIndex(index as number));
        } else if (element === 'export') {
            dispatch(setActiveElement('export') as any);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="relative overflow-x-auto w-full border-t border-gray-300 bg-[#1E1D21]" >
                {/* Header */}
                <Header />
                {/* Video Files Timeline */}
                <div className="bg-[#1E1D21]" >
                    {/* Timeline cursor */}
                    <div
                        className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-10"
                        style={{
                            // TODO: Arbitrary offset but it works for now
                            left: `${currentTime * 100 + 50}px`,
                        }}
                    />
                    <div className="relative h-16 min-w-[800px]">
                        {/* Video Logo in the left side */}
                        <div className="flex items-center gap-2 p-4 min-w-[200px]">
                            <Image
                                alt="Video"
                                className="h-auto w-auto max-w-[30px] max-h-[30px]"
                                height={30}
                                width={30}
                                src="https://www.svgrepo.com/show/532727/video.svg"
                            />
                        </div>
                        <VideoTimeline />
                    </div>

                    {/* Audio Files Timeline */}
                    <div className="bg-[#1E1D21]" >
                        <div className="relative h-16 min-w-[800px]">

                            {/* Audio Logo in the left side */}
                            <div className="flex items-center gap-2 p-4 min-w-[200px]">
                                <Image
                                    alt="Audio"
                                    className="h-auto mr-2 w-auto max-w-[30px] max-h-[30px]"
                                    height={30}
                                    width={30}
                                    src="https://www.svgrepo.com/show/532708/music.svg"
                                />
                            </div>

                            {mediaFiles
                                .filter(clip => clip.type === 'audio')
                                .map((clip) => (
                                    <div
                                        onClick={() => handleClick('media', clip.id)}
                                        key={clip.id}
                                        className={`absolute border border-gray-500 border-opacity-50 rounded-md top-2 h-12 rounded bg-[#27272A] text-white text-sm flex items-center justify-center cursor-pointer ${activeElement === 'media' && mediaFiles[activeElementIndex].id === clip.id ? 'bg-[#3F3F46]' : ''}`}
                                        style={{
                                            left: `${clip.positionStart * 100 + 60}px`,
                                            width: `${(clip.positionEnd / clip.playbackSpeed - clip.positionStart / clip.playbackSpeed) * 100}px`,
                                        }}
                                    >
                                        <Image
                                            alt="Audio"
                                            className="h-auto mr-2 w-auto max-w-[30px] max-h-[30px]"
                                            height={30}
                                            width={30}
                                            src="https://www.svgrepo.com/show/532708/music.svg"
                                        />
                                        <span className="text-x">{clip.fileName}</span>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Image Files Timeline */}
                    <div className="bg-[#1E1D21]" >
                        <div className="relative h-16 min-w-[800px]">

                            {/* Image Logo in the left side */}
                            <div className="flex items-center gap-2 p-4 min-w-[200px]">
                                <Image
                                    alt="Video"
                                    className="h-auto mr-2 w-auto max-w-[30px] max-h-[30px]"
                                    height={30}
                                    width={30}
                                    src="https://www.svgrepo.com/show/535454/image.svg"
                                />
                            </div>

                            {mediaFiles
                                .filter(clip => clip.type === 'image')
                                .map((clip) => (
                                    <div
                                        onClick={() => handleClick('media', clip.id)}
                                        key={clip.id}
                                        className={`absolute border border-gray-500 border-opacity-50 rounded-md top-2 h-12 rounded bg-[#27272A] text-white text-sm flex items-center justify-center cursor-pointer ${activeElement === 'media' && mediaFiles[activeElementIndex].id === clip.id ? 'bg-[#3F3F46]' : ''}`}
                                        style={{
                                            left: `${clip.positionStart * 100 + 60}px`,
                                            width: `${(clip.positionEnd / clip.playbackSpeed - clip.positionStart / clip.playbackSpeed) * 100}px`,
                                        }}
                                    >
                                        <Image
                                            alt="Video"
                                            className="h-auto mr-2 w-auto max-w-[30px] max-h-[30px]"
                                            height={30}
                                            width={30}
                                            src="https://www.svgrepo.com/show/535454/image.svg"
                                        />
                                        <span className="text-x">{clip.fileName}</span>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Text Elements Timeline */}
                    <div className="relative h-16 min-w-[800px]">

                        {/* Text Logo in the left side */}
                        <div className="flex items-center gap-2 p-4 min-w-[200px]">
                            <Image
                                alt="Text"
                                className="h-auto mr-2 w-auto max-w-[30px] max-h-[30px]"
                                height={30}
                                width={30}
                                src="https://www.svgrepo.com/show/535686/text.svg"
                            />
                        </div>

                        {textElements.map((clip, index) => (
                            <div
                                onClick={() => handleClick('text', index)}
                                key={clip.id}
                                className={`absolute border border-gray-500 border-opacity-50 rounded-md top-2 h-12 rounded bg-[#27272A] text-white text-sm flex items-center justify-center cursor-pointer ${activeElement === 'text' && textElements[activeElementIndex].id === clip.id ? 'bg-[#3F3F46]' : ''}`}
                                style={{
                                    left: `${clip.positionStart * 100 + 60}px`,
                                    width: `${(clip.positionEnd - clip.positionStart) * 100}px`,
                                }}
                            >
                                <Image
                                    alt="Text"
                                    className="h-auto mr-2 w-auto max-w-[30px] max-h-[30px]"
                                    height={30}
                                    width={30}
                                    src="https://www.svgrepo.com/show/535686/text.svg"
                                />
                                <span className="text-x">{clip.text}</span>
                            </div>
                        ))}
                    </div>

                </div>
            </div >
        </div>

    );
};

export default memo(Timeline)
