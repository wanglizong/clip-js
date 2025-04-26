import React, { useRef, useCallback, useMemo } from "react";
import Moveable, { OnScale, OnDrag, OnResize, OnRotate } from "react-moveable";
import { useAppSelector } from "@/app/store";
import { setActiveElement, setActiveElementIndex, setMediaFiles } from "@/app/store/slices/projectSlice";
import { memo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import Header from "../Header";
import { MediaFile } from "@/app/types";
import { debounce, throttle } from "lodash";

export default function VideoTimeline() {
    const targetRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const { mediaFiles, textElements, activeElement, activeElementIndex, currentTime } = useAppSelector((state) => state.projectState);
    const dispatch = useDispatch();


    // this affect the performance cause of too much re-renders

    // const onUpdateMedia = (id: string, updates: Partial<MediaFile>) => {
    //     dispatch(setMediaFiles(mediaFiles.map(media =>
    //         media.id === id ? { ...media, ...updates } : media
    //     )));
    // };

    // TODO: this is a hack to prevent the mediaFiles from being updated too often while dragging or resizing
    const mediaFilesRef = useRef(mediaFiles);
    useEffect(() => {
        mediaFilesRef.current = mediaFiles;
    }, [mediaFiles]);

    const onUpdateMedia = useMemo(() =>
        throttle((id: string, updates: Partial<MediaFile>) => {
            const currentFiles = mediaFilesRef.current;
            const updated = currentFiles.map(media =>
                media.id === id ? { ...media, ...updates } : media
            );
            dispatch(setMediaFiles(updated));
        }, 100), [dispatch]
    );

    const handleClick = (element: string, index: number | string) => {
        if (element === 'media') {
            dispatch(setActiveElement('media') as any);
            // TODO: cause we pass id when media to find the right index i will change this later (this happens cause each timeline pass its index not index from mediaFiles array)
            const actualIndex = mediaFiles.findIndex(clip => clip.id === index as unknown as string);
            dispatch(setActiveElementIndex(actualIndex));
        }
    };

    const handleDrag = (clip: MediaFile, target: HTMLElement, left: number) => {
        // no negative left
        const constrainedLeft = Math.max(left, 0);
        const newPositionStart = constrainedLeft / 100;
        onUpdateMedia(clip.id, {
            positionStart: newPositionStart,
            positionEnd: (newPositionStart - clip.positionStart) + clip.positionEnd,
            endTime: Math.max((newPositionStart - clip.positionStart) + clip.endTime, clip.endTime)
        })

        // TODO: the same arbitrary offset
        target.style.left = `${constrainedLeft + 50}px`;
    };

    const handleRightResize = (clip: MediaFile, target: HTMLElement, width: number) => {
        const newPositionEnd = width / 100;

        onUpdateMedia(clip.id, {
            positionEnd: clip.positionStart + newPositionEnd,
            endTime: Math.max(clip.positionStart + newPositionEnd, clip.endTime)
        })
    };
    const handleLeftResize = (clip: MediaFile, target: HTMLElement, width: number) => {
        const newPositionEnd = width / 100;
        // Ensure we do not resize beyond the right edge of the clip
        const constrainedLeft = Math.max(clip.positionStart + ((clip.positionEnd - clip.positionStart) - newPositionEnd), 0);

        onUpdateMedia(clip.id, {
            positionStart: constrainedLeft,
            startTime: constrainedLeft,
        })
    };

    return (
        <div >
            {mediaFiles
                .filter((clip) => clip.type === 'video')
                .map((clip) => (
                    <div key={clip.id} className="bg-green-500">
                        <div
                            key={clip.id}
                            ref={(el: HTMLDivElement | null) => {
                                if (el) {
                                    targetRefs.current[clip.id] = el;
                                }
                            }}
                            onClick={() => handleClick('media', clip.id)}
                            className={`absolute border border-gray-500 border-opacity-50 rounded-md top-2 h-12 rounded bg-[#27272A] text-white text-sm flex items-center justify-center cursor-pointer ${activeElement === 'media' && mediaFiles[activeElementIndex].id === clip.id ? 'bg-[#3F3F46]' : ''}`}
                            style={{
                                // TODO: i increased each clip 60px to the right to make space for the logo this is not a good solution i will change it later
                                left: `${clip.positionStart * 100 + 50}px`,
                                width: `${(clip.positionEnd / clip.playbackSpeed - clip.positionStart / clip.playbackSpeed) * 100}px`,
                                zIndex: clip.zIndex,
                            }}
                        >
                            {/* <MoveableTimeline /> */}
                            <Image
                                alt="Video"
                                className="h-auto mr-2 w-auto max-w-[30px] max-h-[30px]"
                                height={30}
                                width={30}
                                src="https://www.svgrepo.com/show/532727/video.svg"
                            />
                            <span className="text-x">{clip.fileName}</span>

                        </div>
                        <Moveable
                            target={targetRefs.current[clip.id] || null}
                            container={null}
                            renderDirections={activeElement === 'media' && mediaFiles[activeElementIndex].id === clip.id ? ['w', 'e'] : []}
                            draggable={true}
                            throttleDrag={0}
                            rotatable={false}
                            onDragStart={({ target, clientX, clientY }) => {
                            }}
                            onDrag={({
                                target,
                                beforeDelta, beforeDist,
                                left,
                                right,
                                delta, dist,
                                transform,
                            }: OnDrag) => {
                                handleClick('media', clip.id)
                                handleDrag(clip, target as HTMLElement, left);
                            }}
                            onDragEnd={({ target, isDrag, clientX, clientY }) => {
                            }}

                            /* resizable*/
                            resizable={true}
                            throttleResize={0}
                            onResizeStart={({ target, clientX, clientY }) => {
                            }}
                            onResize={({
                                target, width,
                                delta, direction,
                            }: OnResize) => {
                                if (direction[0] === 1) {
                                    handleClick('media', clip.id)
                                    delta[0] && (target!.style.width = `${width}px`);
                                    handleRightResize(clip, target as HTMLElement, width);
                                }
                                else if (direction[0] === -1) {
                                    handleClick('media', clip.id)
                                    delta[0] && (target!.style.width = `${width}px`);
                                    handleLeftResize(clip, target as HTMLElement, width);
                                }
                            }}
                            onResizeEnd={({ target, isDrag, clientX, clientY }) => {
                            }}
                        />
                    </div>

                ))}
        </div>
    );
}
