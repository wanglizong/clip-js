"use client";

import { useState } from 'react';
import { TextElement } from '../../types';
import { useAppSelector } from '../../store';
import { setTextElements } from '../../store/slices/projectSlice';
import { useAppDispatch } from '../../store';


export default function TextList() {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const { textElements } = useAppSelector((state) => state.projectState);
    const dispatch = useAppDispatch();

    const handleTextClick = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleEditClick = (id: string) => {
        setEditingId(id);
    };

    const handleSave = (id: string, updates: Partial<TextElement>) => {
        onUpdateText(id, updates);
        setEditingId(null);
    };

    const onUpdateText = (id: string, updates: Partial<TextElement>) => {
        dispatch(setTextElements(textElements.map(text =>
            text.id === id ? { ...text, ...updates } : text
        )));
    };

    const onDeleteText = (id: string) => {
        dispatch(setTextElements(textElements.filter(text => text.id !== id)));
    };

    return (
        <div className="fixed right-4 top-4 w-80 bg-white rounded-lg shadow-lg p-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Text Elements</h2>
            <div className="space-y-2">
                {textElements.map((text) => (
                    <div
                        key={text.id}
                        className="border rounded-lg p-2 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleTextClick(text.id)}
                    >
                        <div className="flex justify-between items-center">
                            <div className="truncate">
                                {editingId === text.id ? (
                                    <input
                                        type="text"
                                        value={text.text}
                                        onChange={(e) => handleSave(text.id, { text: e.target.value })}
                                        className="w-full p-1 border rounded"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                ) : (
                                    <span className="font-medium">{text.text}</span>
                                )}
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditClick(text.id);
                                    }}
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteText(text.id);
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>

                        {expandedId === text.id && (
                            <div className="mt-2 space-y-2 text-sm" onClick={(e) => e.stopPropagation()}>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs text-gray-500">Start Time</label>
                                        <input
                                            type="number"
                                            value={text.positionStart}
                                            onChange={(e) => handleSave(text.id, { positionStart: Number(e.target.value) })}
                                            className="w-full p-1 border rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500">End Time</label>
                                        <input
                                            type="number"
                                            value={text.positionEnd}
                                            onChange={(e) => handleSave(text.id, { positionEnd: Number(e.target.value) })}
                                            className="w-full p-1 border rounded"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs text-gray-500">X Position</label>
                                        <input
                                            type="number"
                                            value={text.x}
                                            onChange={(e) => handleSave(text.id, { x: Number(e.target.value) })}
                                            className="w-full p-1 border rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500">Y Position</label>
                                        <input
                                            type="number"
                                            value={text.y}
                                            onChange={(e) => handleSave(text.id, { y: Number(e.target.value) })}
                                            className="w-full p-1 border rounded"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-500">Font Size</label>
                                    <input
                                        type="number"
                                        value={text.fontSize}
                                        onChange={(e) => handleSave(text.id, { fontSize: Number(e.target.value) })}
                                        className="w-full p-1 border rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-500">Z-Index</label>
                                    <input
                                        type="number"
                                        value={text.zIndex}
                                        onChange={(e) => handleSave(text.id, { zIndex: Number(e.target.value) })}
                                        className="w-full p-1 border rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-gray-500">Animation</label>
                                    <select
                                        value={text.animation}
                                        onChange={(e) => handleSave(text.id, { animation: e.target.value as any })}
                                        className="w-full p-1 border rounded"
                                    >
                                        <option value="none">None</option>
                                        <option value="slide-in">Slide In</option>
                                        <option value="zoom">Zoom</option>
                                        <option value="bounce">Bounce</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs text-gray-500">Text Color</label>
                                        <input
                                            type="color"
                                            value={text.color}
                                            onChange={(e) => handleSave(text.id, { color: e.target.value })}
                                            className="w-full h-8 border rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500">Background</label>
                                        <input
                                            type="color"
                                            value={text.backgroundColor}
                                            onChange={(e) => handleSave(text.id, { backgroundColor: e.target.value })}
                                            className="w-full h-8 border rounded"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
} 