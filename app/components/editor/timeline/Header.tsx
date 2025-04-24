import React, { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store';
export const Header = () => {
    const { duration, currentTime } = useAppSelector((state) => state.projectState);
    const timeMarkers = Array.from({ length: duration * 2 }, (_, i) => i);

    // TODO: this when clicking timeline header but is not used now

    // const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    //     if (!timelineRef.current) return;
    //     const rect = timelineRef.current.getBoundingClientRect();
    //     // TODO: Arbitrary offset but it works for now
    //     const offsetX = e.clientX - rect.left - 70;
    //     const seconds = offsetX / 100;
    //     const clampedTime = Math.max(0, Math.min(duration, seconds));
    //     dispatch(setCurrentTime(clampedTime));
    // };

    // to track the marker when time changes
    const markerRefs = useRef<HTMLDivElement[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const roundedTime = Math.floor(currentTime);
        const el = markerRefs.current[roundedTime];
        if (el && el.scrollIntoView) {
            el.scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'nearest',
            });
        }
    }, [currentTime]);


    return (
        <div className="flex items-center gap-2 p-2 w-full cursor-pointer" ref={containerRef}>
            <div className="min-w-[50px]"></div>
            <div className="relative h-8 min-w-[800px]" >
                {timeMarkers.map((marker) => (
                    <div
                        key={marker}
                        ref={(el) => {
                            if (el) markerRefs.current[marker] = el;
                        }}
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