"use client";

import { useEffect, useRef } from 'react';
import { SoundFile } from './FileUploader';
import { useAppSelector, useAppDispatch } from '../store';
import { setCurrentTime, setIsPlaying, setIsMuted } from '../store/slices/soundSlice';

export default function CanvasSoundPreview() {
    const dispatch = useAppDispatch();
    const { soundFiles, currentTime, isPlaying, isMuted } = useAppSelector((state) => state.sound);

    const audioElementsRef = useRef<HTMLAudioElement[]>([]);
    const audioContextRef = useRef<AudioContext | null>(null);
    const gainNodesRef = useRef<GainNode[]>([]);

    // Initialize audio context and create audio elements
    useEffect(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new AudioContext();
        }

        // Clear existing audio elements
        audioElementsRef.current.forEach(audio => {
            audio.pause();
            audio.src = '';
        });
        audioElementsRef.current = [];
        gainNodesRef.current = [];

        // Create new audio elements and gain nodes
        soundFiles.forEach((soundFile, index) => {
            const audio = document.createElement('audio');
            audio.src = URL.createObjectURL(soundFile.file);
            audio.loop = true;
            audio.preload = 'auto';

            // Create gain node for volume control
            const gainNode = audioContextRef.current!.createGain();
            gainNode.gain.value = soundFile.volume;
            gainNodesRef.current.push(gainNode);

            // Connect audio to gain node and gain node to destination
            const source = audioContextRef.current!.createMediaElementSource(audio);
            source.connect(gainNode);
            gainNode.connect(audioContextRef.current!.destination);

            audioElementsRef.current.push(audio);

            audio.addEventListener('loadedmetadata', () => {
                // Set initial position
                if (currentTime >= soundFile.positionStart && currentTime <= soundFile.positionEnd) {
                    const audioTime = currentTime - soundFile.positionStart;
                    audio.currentTime = audioTime;
                }
            });
        });

        return () => {
            audioElementsRef.current.forEach(audio => {
                audio.pause();
                URL.revokeObjectURL(audio.src);
            });
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, [soundFiles]);

    // Handle playback and position updates
    useEffect(() => {
        soundFiles.forEach((soundFile, index) => {
            const audio = audioElementsRef.current[index];
            if (!audio) return;

            const isActive = currentTime >= soundFile.positionStart &&
                currentTime <= soundFile.positionEnd;

            if (isActive) {
                if (isPlaying && audio.paused) {
                    const audioTime = currentTime - soundFile.positionStart;
                    audio.currentTime = audioTime;
                    audio.play().catch(console.error);
                } else if (!isPlaying) {
                    audio.pause();
                }
            } else {
                audio.pause();
                if (currentTime < soundFile.positionStart) {
                    audio.currentTime = 0;
                }
            }
        });
    }, [currentTime, isPlaying, soundFiles]);

    // Handle mute state
    useEffect(() => {
        gainNodesRef.current.forEach(gainNode => {
            gainNode.gain.value = isMuted ? 0 : 1;
        });
    }, [isMuted]);

    // Update volume for a specific sound
    const updateVolume = (index: number, volume: number) => {
        if (gainNodesRef.current[index]) {
            gainNodesRef.current[index].gain.value = volume;
        }
    };

    return null; // This component doesn't render anything visible
} 