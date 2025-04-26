import React, { useRef, useCallback, useMemo } from "react";
import Moveable, { OnScale, OnDrag, OnResize, OnRotate } from "react-moveable";
import { useAppSelector } from "@/app/store";
import { setActiveElement, setActiveElementIndex, setTextElements } from "@/app/store/slices/projectSlice";
import { memo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import Header from "../Header";
import { TextElement } from "@/app/types";
import { debounce, throttle } from "lodash";

export default function TextTimeline() {
    const targetRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const { textElements, activeElement, activeElementIndex, currentTime } = useAppSelector((state) => state.projectState);
    const dispatch = useDispatch();


    // this affect the performance cause of too much re-renders

    // const onUpdateMedia = (id: string, updates: Partial<MediaFile>) => {
    //     dispatch(setMediaFiles(mediaFiles.map(media =>
    //         media.id === id ? { ...media, ...updates } : media
    //     )));
    // };

    // TODO: this is a hack to prevent the mediaFiles from being updated too often while dragging or resizing
    const textElementsRef = useRef(textElements);
    useEffect(() => {
        textElementsRef.current = textElements;
    }, [textElements]);

    const onUpdateText = useMemo(() =>
        throttle((id: string, updates: Partial<TextElement>) => {
            const currentFiles = textElementsRef.current;
            const updated = currentFiles.map(text =>
                text.id === id ? { ...text, ...updates } : text
            );
            dispatch(setTextElements(updated));
        }, 100), [dispatch]
    );

    const handleClick = (element: string, index: number | string) => {
        if (element === 'text') {
            dispatch(setActiveElement('text') as any);
            // TODO: find better way to do this
            const actualIndex = textElements.findIndex(clip => clip.id === index as unknown as string);
            dispatch(setActiveElementIndex(actualIndex));
        }
    };

    const handleDrag = (clip: TextElement, target: HTMLElement, left: number) => {
        // no negative left
        const constrainedLeft = Math.max(left, 0);
        const newPositionStart = constrainedLeft / 100;
        onUpdateText(clip.id, {
            positionStart: newPositionStart,
            positionEnd: (newPositionStart - clip.positionStart) + clip.positionEnd,
        })

        // TODO: the same arbitrary offset
        target.style.left = `${constrainedLeft + 50}px`;
    };

    const handleResize = (clip: TextElement, target: HTMLElement, width: number) => {
        const newPositionEnd = width / 100;

        onUpdateText(clip.id, {
            positionEnd: clip.positionStart + newPositionEnd,
        })
    };

    return (
        <div >
            {textElements.map((clip, index) => (
                <div key={clip.id} className="bg-green-500">
                    <div
                        key={clip.id}
                        ref={(el) => (targetRefs.current[clip.id] = el)}
                        onClick={() => handleClick('text', clip.id)}
                        className={`absolute border border-gray-500 border-opacity-50 rounded-md top-2 h-12 rounded bg-[#27272A] text-white text-sm flex items-center justify-center cursor-pointer ${activeElement === 'text' && textElements[activeElementIndex].id === clip.id ? 'bg-[#3F3F46]' : ''}`}
                        style={{
                            // TODO: i increased each clip 60px to the right to make space for the logo this is not a good solution i will change it later
                            left: `${clip.positionStart * 100 + 50}px`,
                            width: `${(clip.positionEnd - clip.positionStart) * 100}px`,
                            zIndex: clip.zIndex,
                        }}
                    >
                        {/* <MoveableTimeline /> */}
                        <Image
                            alt="Text"
                            className="h-auto mr-2 w-auto max-w-[30px] max-h-[30px]"
                            height={30}
                            width={30}
                            src="https://www.svgrepo.com/show/535686/text.svg"
                        />
                        <span className="text-x">{clip.text}</span>

                    </div>

                    <Moveable
                        target={targetRefs.current[clip.id] || null}
                        container={null}
                        renderDirections={activeElement === 'text' && textElements[activeElementIndex] && textElements[activeElementIndex].id === clip.id ? ['w', 'e'] : []}
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
                            handleClick('text', clip.id)
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
                                handleClick('text', clip.id)
                                delta[0] && (target!.style.width = `${width}px`);
                                handleResize(clip, target as HTMLElement, width);

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
