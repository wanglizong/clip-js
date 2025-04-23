'use client';

import { useEffect } from 'react';

interface GlobalKeyHandlerProps {
    onSpace?: () => void;
    onMute?: () => void;
}

const GlobalKeyHandler = ({ onSpace, onMute }: GlobalKeyHandlerProps) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;

            const isTyping =
                target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

            if (isTyping) return;

            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    onSpace?.();
                    break;
                case 'KeyM':
                    e.preventDefault();
                    onMute?.();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onSpace, onMute]);

    return null;
};

export default GlobalKeyHandler;
