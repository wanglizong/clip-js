"use client";

import { useState } from 'react';
import { TextElement } from '../../types';
import { useAppDispatch, useAppSelector } from "../../store";
import { setTextElements } from '../../store/slices/projectSlice';


export default function AddTextButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);
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
        setIsModalOpen(false);
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
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
                Add Text
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Add Text Element</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Text Content</label>
                                <input
                                    type="text"
                                    value={textConfig.text}
                                    onChange={(e) => setTextConfig({ ...textConfig, text: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Start Time (s)</label>
                                    <input
                                        type="number"
                                        value={textConfig.positionStart}
                                        onChange={(e) => setTextConfig({ ...textConfig, positionStart: Number(e.target.value) })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">End Time (s)</label>
                                    <input
                                        type="number"
                                        value={textConfig.positionEnd}
                                        onChange={(e) => setTextConfig({ ...textConfig, positionEnd: Number(e.target.value) })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">X Position</label>
                                    <input
                                        type="number"
                                        value={textConfig.x}
                                        onChange={(e) => setTextConfig({ ...textConfig, x: Number(e.target.value) })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Y Position</label>
                                    <input
                                        type="number"
                                        value={textConfig.y}
                                        onChange={(e) => setTextConfig({ ...textConfig, y: Number(e.target.value) })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Font Size</label>
                                <input
                                    type="number"
                                    value={textConfig.fontSize}
                                    onChange={(e) => setTextConfig({ ...textConfig, fontSize: Number(e.target.value) })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Text Color</label>
                                <input
                                    type="color"
                                    value={textConfig.color}
                                    onChange={(e) => setTextConfig({ ...textConfig, color: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Background Color</label>
                                <input
                                    type="color"
                                    value={textConfig.backgroundColor}
                                    onChange={(e) => setTextConfig({ ...textConfig, backgroundColor: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Z-Index</label>
                                <input
                                    type="number"
                                    value={textConfig.zIndex}
                                    onChange={(e) => setTextConfig({ ...textConfig, zIndex: Number(e.target.value) })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Animation</label>
                                <select
                                    value={textConfig.animation}
                                    onChange={(e) => setTextConfig({ ...textConfig, animation: e.target.value as any })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="none">None</option>
                                    <option value="slide-in">Slide In</option>
                                    <option value="zoom">Zoom</option>
                                    <option value="bounce">Bounce</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddText}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md"
                            >
                                Add Text
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 