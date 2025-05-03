import { useAppSelector } from "@/app/store";
import { setActiveElement, setActiveElementIndex, setMarkerTrack, setTimelineZoom } from "@/app/store/slices/projectSlice";
import { memo, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import Header from "./Header";
import VideoTimeline from "./elements-timeline/VideoTimeline";
import ImageTimeline from "./elements-timeline/ImageTimeline";
import AudioTimeline from "./elements-timeline/AudioTimline";
import TextTimeline from "./elements-timeline/TextTimeline";
import { throttle } from 'lodash';

export const Timeline = () => {
    const { currentTime, timelineZoom, enableMarkerTracking } = useAppSelector((state) => state.projectState);
    const dispatch = useDispatch();

    const throttledZoom = useCallback(
        throttle((value: number) => {
            dispatch(setTimelineZoom(value));
        }, 100),
        []
    );

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-12 px-16 w-3/6">
                <div className="flex flex-row justify-between items-center gap-2 py-2">
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

                <div className="flex flex-row justify-between items-center gap-2 py-2">
                    <input
                        type="checkbox"
                        checked={enableMarkerTracking}
                        onChange={() => dispatch(setMarkerTrack(!enableMarkerTracking))}
                    />
                    <span className="block text-sm mt-1 font-semibold text-white">Track Marker</span>
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
                            // TODO: Arbitrary offset but it works for now
                            left: `${currentTime * timelineZoom + 50}px`,
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
                            <AudioTimeline />
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
                            <ImageTimeline />
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
                        <TextTimeline />
                    </div>

                </div>
            </div >
        </div>

    );
};

export default memo(Timeline)
