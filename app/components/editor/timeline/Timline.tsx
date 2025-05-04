import { useAppSelector } from "@/app/store";
import { setMarkerTrack, setTextElements, setMediaFiles, setTimelineZoom } from "@/app/store/slices/projectSlice";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import Header from "./Header";
import VideoTimeline from "./elements-timeline/VideoTimeline";
import ImageTimeline from "./elements-timeline/ImageTimeline";
import AudioTimeline from "./elements-timeline/AudioTimline";
import TextTimeline from "./elements-timeline/TextTimeline";
import { throttle } from 'lodash';
import { MediaFile } from "@/app/types";
import toast from "react-hot-toast";
export const Timeline = () => {
    const { currentTime, timelineZoom, enableMarkerTracking, activeElement, activeElementIndex, mediaFiles, textElements } = useAppSelector((state) => state.projectState);
    const dispatch = useDispatch();

    const throttledZoom = useMemo(() =>
        throttle((value: number) => {
            dispatch(setTimelineZoom(value));
        }, 100),
        [dispatch]
    );

    const handleSplit = () => {
        let element = null;
        let elements = null;
        let setElements = null;

        if (activeElement === 'media') {
            elements = [...mediaFiles];
            element = elements[activeElementIndex];
            setElements = setMediaFiles;

            if (!element) {
                toast.error('No element selected.');
                return;
            }

            const { positionStart, positionEnd } = element;

            if (currentTime <= positionStart || currentTime >= positionEnd) {
                toast.error('Marker is outside the selected element bounds.');
                return;
            }

            const positionDuration = positionEnd - positionStart;

            // Media logic (uses startTime/endTime for trimming)
            const { startTime, endTime } = element;
            const sourceDuration = endTime - startTime;
            const ratio = (currentTime - positionStart) / positionDuration;
            const splitSourceOffset = startTime + ratio * sourceDuration;

            const firstPart = {
                ...element,
                id: crypto.randomUUID(),
                positionStart,
                positionEnd: currentTime,
                startTime,
                endTime: splitSourceOffset
            };

            const secondPart = {
                ...element,
                id: crypto.randomUUID(),
                positionStart: currentTime,
                positionEnd,
                startTime: splitSourceOffset,
                endTime
            };

            elements.splice(activeElementIndex, 1, firstPart, secondPart);
        } else if (activeElement === 'text') {
            elements = [...textElements];
            element = elements[activeElementIndex];
            setElements = setTextElements;

            if (!element) {
                toast.error('No element selected.');
                return;
            }

            const { positionStart, positionEnd } = element;

            if (currentTime <= positionStart || currentTime >= positionEnd) {
                toast.error('Marker is outside the selected element bounds.');
                return;
            }

            const firstPart = {
                ...element,
                id: crypto.randomUUID(),
                positionStart,
                positionEnd: currentTime,
            };

            const secondPart = {
                ...element,
                id: crypto.randomUUID(),
                positionStart: currentTime,
                positionEnd,
            };

            elements.splice(activeElementIndex, 1, firstPart, secondPart);
        }

        if (elements && setElements) {
            dispatch(setElements(elements as any));
            toast.success('Element split successfully.');
        }
    };

    const handleDuplicate = () => {
        let element = null;
        let elements = null;
        let setElements = null;

        if (activeElement === 'media') {
            elements = [...mediaFiles];
            element = elements[activeElementIndex];
            setElements = setMediaFiles;
        } else if (activeElement === 'text') {
            elements = [...textElements];
            element = elements[activeElementIndex];
            setElements = setTextElements;
        }

        if (!element) {
            toast.error('No element selected.');
            return;
        }

        const duplicatedElement = {
            ...element,
            id: crypto.randomUUID(),
        };

        if (elements) {
            elements.splice(activeElementIndex + 1, 0, duplicatedElement as any);
        }

        if (elements && setElements) {
            dispatch(setElements(elements as any));
            toast.success('Element duplicated successfully.');
        }
    };


    return (
        <div className="flex w-full flex-col gap-2">
            <div className="flex flex-row items-center justify-between gap-12 px-2 w-full">
                <div className="flex flex-row items-center gap-2">
                    {/* Track Marker */}
                    <button
                        onClick={() => dispatch(setMarkerTrack(!enableMarkerTracking))}
                        className="bg-white border rounded-md border-transparent transition-colors flex flex-row items-center justify-center text-gray-800 hover:bg-[#ccc] dark:hover:bg-[#ccc] mt-2 font-medium text-sm sm:text-base h-auto px-2 py-1 sm:w-auto"
                    >
                        {enableMarkerTracking ? <Image
                            alt="cut"
                            className="h-auto w-auto max-w-[20px] max-h-[20px]"
                            height={30}
                            width={30}
                            src="https://www.svgrepo.com/show/447546/yes-alt.svg"
                        /> : <Image
                            alt="cut"
                            className="h-auto w-auto max-w-[20px] max-h-[20px]"
                            height={30}
                            width={30}
                            src="https://www.svgrepo.com/show/447315/dismiss.svg"
                        />}
                        <span className="ml-2">Track Marker</span>
                    </button>
                    {/* Split */}
                    <button
                        onClick={handleSplit}
                        className="bg-white border rounded-md border-transparent transition-colors flex flex-row items-center justify-center text-gray-800 hover:bg-[#ccc] dark:hover:bg-[#ccc] mt-2 font-medium text-sm sm:text-base h-auto px-2 py-1 sm:w-auto"
                    >
                        <Image
                            alt="cut"
                            className="h-auto w-auto max-w-[20px] max-h-[20px]"
                            height={30}
                            width={30}
                            src="https://www.svgrepo.com/show/509075/cut.svg"
                        />
                        <span className="ml-2">Split</span>
                    </button>
                    {/* Duplicate */}
                    <button
                        onClick={handleDuplicate}
                        className="bg-white border rounded-md border-transparent transition-colors flex flex-row items-center justify-center text-gray-800 hover:bg-[#ccc] dark:hover:bg-[#ccc] mt-2 font-medium text-sm sm:text-base h-auto px-2 py-1 sm:w-auto"
                    >
                        <Image
                            alt="cut"
                            className="h-auto w-auto max-w-[20px] max-h-[20px]"
                            height={30}
                            width={30}
                            src="https://www.svgrepo.com/show/521623/duplicate.svg"
                        />
                        <span className="ml-2">Duplicate</span>
                    </button>
                </div>

                {/* Timeline Zoom */}
                <div className="flex flex-row justify-between items-center gap-2 mr-4">
                    <label className="block text-sm mt-1 font-semibold text-white">Zoom</label>
                    <span className="text-white text-lg">-</span>
                    <input
                        type="range"
                        min={30}
                        max={120}
                        step="1"
                        value={timelineZoom}
                        onChange={(e) => throttledZoom(Number(e.target.value))}
                        className="w-[100px] bg-darkSurfacePrimary border border-white border-opacity-10 shadow-md text-white rounded focus:outline-none focus:border-white-500"
                    />
                    <span className="text-white text-lg">+</span>
                </div>
            </div>

            <div className="relative overflow-x-auto w-full border-t border-gray-800 bg-[#1E1D21]" >
                {/* Header */}
                <Header />
                {/* Video Files Timeline */}
                <div className="bg-[#1E1D21]" >
                    {/* Timeline cursor */}
                    <div
                        className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-10"
                        style={{
                            left: `${currentTime * timelineZoom}px`,
                        }}
                    />
                    <div className="relative h-16 min-w-[800px]">
                        <VideoTimeline />
                    </div>

                    {/* Audio Files Timeline */}
                    <div className="bg-[#1E1D21]" >
                        <div className="relative h-16 min-w-[800px]">
                            <AudioTimeline />
                        </div>
                    </div>

                    {/* Image Files Timeline */}
                    <div className="bg-[#1E1D21]" >
                        <div className="relative h-16 min-w-[800px]">
                            <ImageTimeline />
                        </div>
                    </div>

                    {/* Text Elements Timeline */}
                    <div className="relative h-16 min-w-[800px]">
                        <TextTimeline />
                    </div>

                </div>
            </div >
        </div>

    );
};

export default memo(Timeline)
