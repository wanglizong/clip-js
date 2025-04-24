"use client";

import { useState } from 'react';
import { TextElement } from '../../../../types';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { setTextElements } from '../../../../store/slices/projectSlice';
import Image from 'next/image';

export default function AddTextButton() {
    const [textConfig, setTextConfig] = useState<Partial<TextElement>>({
        text: '',
        positionStart: 0,
        positionEnd: 10,
        x: 0,
        y: 0,
        fontSize: 24,
        color: '#ffffff',
        backgroundColor: 'transparent',
        align: 'center',
        zIndex: 0,
        opacity: 1,
        rotation: 0,
        animation: 'none'
    });
    const { textElements } = useAppSelector((state) => state.projectState);
    const dispatch = useAppDispatch();

    const onAddText = (textElement: TextElement) => {
        dispatch(setTextElements([...textElements, textElement]));
    };

    const handleAddText = () => {
        const newTextElement: TextElement = {
            id: crypto.randomUUID(),
            text: textConfig.text || '',
            positionStart: textConfig.positionStart || 0,
            positionEnd: textConfig.positionEnd || 10,
            x: textConfig.x || 0,
            y: textConfig.y || 0,
            width: textConfig.width,
            height: textConfig.height,
            font: textConfig.font || 'Arial',
            fontSize: textConfig.fontSize || 24,
            color: textConfig.color || '#ffffff',
            backgroundColor: textConfig.backgroundColor || 'transparent',
            align: textConfig.align || 'center',
            zIndex: textConfig.zIndex || 0,
            opacity: textConfig.opacity || 1,
            rotation: textConfig.rotation || 0,
            fadeInDuration: textConfig.fadeInDuration,
            fadeOutDuration: textConfig.fadeOutDuration,
            animation: textConfig.animation || 'none'
        };

        onAddText(newTextElement);
        // Reset form
        setTextConfig({
            text: '',
            positionStart: 0,
            positionEnd: 10,
            x: 0,
            y: 0,
            fontSize: 24,
            color: '#ffffff',
            backgroundColor: 'transparent',
            align: 'center',
            zIndex: 0,
            opacity: 1,
            rotation: 0,
            animation: 'none'
        });
    };

    return (
        <div className="relative">
            {(
                <div className="flex items-center justify-center z-50">
                    <div className="p-6 rounded-lg w-96">
                        <div className="space-y-8">
                            <div>
                                <label className="text-xl font-bold mb-2 text-white">Text Content</label>
                                <textarea
                                    // type="text"
                                    value={textConfig.text}
                                    onChange={(e) => setTextConfig({ ...textConfig, text: e.target.value })}
                                    className="w-full p-2 bg-darkSurfacePrimary border border-white border-opacity-10 shadow-md text-white rounded focus:outline-none focus:ring-2 focus:ring-white-500 focus:border-white-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white">Start Time (s)</label>
                                    <input
                                        type="number"
                                        value={textConfig.positionStart}
                                        onChange={(e) => setTextConfig({ ...textConfig, positionStart: Number(e.target.value) })}
                                        className="w-full p-2 bg-darkSurfacePrimary border border-white border-opacity-10 shadow-md text-white rounded focus:outline-none focus:ring-2 focus:ring-white-500 focus:border-white-500"
                                        min={0}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white">End Time (s)</label>
                                    <input
                                        type="number"
                                        value={textConfig.positionEnd}
                                        onChange={(e) => setTextConfig({ ...textConfig, positionEnd: Number(e.target.value) })}
                                        className="w-full p-2 bg-darkSurfacePrimary border border-white border-opacity-10 shadow-md text-white rounded focus:outline-none focus:ring-2 focus:ring-white-500 focus:border-white-500"
                                        min={0}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white">X Position</label>
                                    <input
                                        type="number"
                                        value={textConfig.x}
                                        onChange={(e) => setTextConfig({ ...textConfig, x: Number(e.target.value) })}
                                        className="w-full p-2 bg-darkSurfacePrimary border border-white border-opacity-10 shadow-md text-white rounded focus:outline-none focus:ring-2 focus:ring-white-500 focus:border-white-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white">Y Position</label>
                                    <input
                                        type="number"
                                        value={textConfig.y}
                                        onChange={(e) => setTextConfig({ ...textConfig, y: Number(e.target.value) })}
                                        className="w-full p-2 bg-darkSurfacePrimary border border-white border-opacity-10 shadow-md text-white rounded focus:outline-none focus:ring-2 focus:ring-white-500 focus:border-white-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white">Font Size</label>
                                    <input
                                        type="number"
                                        value={textConfig.fontSize}
                                        onChange={(e) => setTextConfig({ ...textConfig, fontSize: Number(e.target.value) })}
                                        className="w-full p-2 bg-darkSurfacePrimary border border-white border-opacity-10 shadow-md text-white rounded focus:outline-none focus:ring-2 focus:ring-white-500 focus:border-white-500"
                                        min={0}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white">Z-Index</label>
                                    <input
                                        type="number"
                                        value={textConfig.zIndex}
                                        onChange={(e) => setTextConfig({ ...textConfig, zIndex: Number(e.target.value) })}
                                        className="w-full p-2 bg-darkSurfacePrimary border border-white border-opacity-10 shadow-md text-white rounded focus:outline-none focus:ring-2 focus:ring-white-500 focus:border-white-500"
                                        min={0}
                                    />
                                </div>
                            </div>


                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white">Text Color</label>
                                    <input
                                        type="color"
                                        value={textConfig.color}
                                        onChange={(e) => setTextConfig({ ...textConfig, color: e.target.value })}
                                        className="mt-1 block w-full bg-darkSurfacePrimary rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white">Background </label>
                                    <input
                                        type="color"
                                        value={textConfig.backgroundColor}
                                        onChange={(e) => setTextConfig({ ...textConfig, backgroundColor: e.target.value })}
                                        className="mt-1 block w-full bg-darkSurfacePrimary  rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    onClick={handleAddText}
                                    className="px-4 py-2 bg-white text-black hover:bg-[#ccc] rounded"
                                >
                                    Add Text
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
} 