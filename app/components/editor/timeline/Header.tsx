import React, { useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store';
import { setCurrentTime } from '@/app/store/slices/projectSlice';
export const Header = () => {
    const { duration, currentTime } = useAppSelector((state) => state.projectState);
    const timelineRef = useRef<HTMLDivElement>(null);
    const timeMarkers = Array.from({ length: duration }, (_, i) => i);
    const dispatch = useAppDispatch();
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!timelineRef.current) return;
        const rect = timelineRef.current.getBoundingClientRect();
        // TODO: Arbitrary offset but it works for now
        const offsetX = e.clientX - rect.left - 70;
        const seconds = offsetX / 100;
        const clampedTime = Math.max(0, Math.min(duration, seconds));
        dispatch(setCurrentTime(clampedTime));
    };
    return (
        <div className="flex items-center gap-2 p-2 w-full cursor-pointer" ref={timelineRef} onClick={handleClick}>
            <div className="min-w-[50px]"></div>
            <div className="relative h-8 min-w-[800px]" >
                {timeMarkers.map((marker) => (
                    <div
                        key={marker}
                        className="absolute top-0 text-gray-400 text-xs"
                        style={{
                            left: `${marker * 100}px`,
                            width: `${100}px`,
                        }}
                    >
                        {marker}s
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Header; 