"use client";

import { useEffect, useRef, useState } from 'react';
import { VideoFile } from './FileUploader';

interface CanvasVideoPreviewProps {
    videoFiles: VideoFile[];
    width?: number;
    height?: number;
}

export default function CanvasVideoPreview({ videoFiles, width = 640, height = 360 }: CanvasVideoPreviewProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const videoElementsRef = useRef<HTMLVideoElement[]>([]);
    const animationFrameRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackSpeeds, setPlaybackSpeeds] = useState<number[]>([]);
    const timelineRef = useRef<HTMLDivElement>(null);

    // Calculate total duration
    useEffect(() => {
        if (videoFiles.length === 0) return;
        const maxEndTime = Math.max(...videoFiles.map(v => v.positionEnd));
        setDuration(maxEndTime);
    }, [videoFiles]);

    // Initialize playback speeds when videoFiles change
    useEffect(() => {
        setPlaybackSpeeds(videoFiles.map(() => 1));
    }, [videoFiles]);

    // Format time helper
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle timeline click
    const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!timelineRef.current) return;

        const rect = timelineRef.current.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        const percentage = clickPosition / rect.width;
        const newTime = percentage * duration;

        // Update all videos
        videoFiles.forEach((videoFile, index) => {
            const video = videoElementsRef.current[index];
            if (!video) return;

            if (newTime >= videoFile.positionStart && newTime <= videoFile.positionEnd) {
                const videoTime = videoFile.startTime + (newTime - videoFile.positionStart);
                video.currentTime = videoTime;
                if (isPlaying) {
                    video.play().catch(console.error);
                }
            } else {
                video.pause();
                if (newTime < videoFile.positionStart) {
                    video.currentTime = videoFile.startTime;
                }
            }
        });

        startTimeRef.current = performance.now() - (newTime * 1000);
        setCurrentTime(newTime);
    };

    // Initialize canvas
    const initCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Canvas context not supported');
            return;
        }

        ctxRef.current = ctx;
        canvas.width = width;
        canvas.height = height;
    };

    // Create video elements
    const setupVideos = () => {
        // Clear existing videos
        videoElementsRef.current.forEach(video => {
            video.pause();
            video.src = '';
        });
        videoElementsRef.current = [];

        // Create new video elements
        videoFiles.forEach((videoFile, index) => {
            const video = document.createElement('video');
            video.src = URL.createObjectURL(videoFile.file);
            video.loop = true;
            video.muted = isMuted;
            video.playsInline = true;
            video.preload = 'auto';

            videoElementsRef.current.push(video);

            video.addEventListener('loadedmetadata', () => {
                video.currentTime = videoFile.startTime;
                // video.play().catch(console.error);
            });
        });
    };

    // Draw frame
    const drawFrame = (timestamp: number) => {
        const ctx = ctxRef.current;
        if (!ctx) return;

        if (!startTimeRef.current) {
            startTimeRef.current = timestamp;
        }
        const currentTimeSeconds = (timestamp - startTimeRef.current) / 1000;

        // Stop if we've reached the end
        if (currentTimeSeconds >= duration) {
            setIsPlaying(false);
            setCurrentTime(duration);
            videoElementsRef.current.forEach(video => {
                video.pause();
                video.currentTime = video.duration;
            });
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
            return;
        }

        setCurrentTime(currentTimeSeconds);

        // Clear canvas
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, width, height);

        let allVideosEnded = true;
        let firstActiveVideoIndex = -1;

        // Handle all videos
        videoFiles.forEach((videoFile, index) => {
            const video = videoElementsRef.current[index];
            if (!video) return;

            // Check if current time is within this video's time range
            const isActive = currentTimeSeconds >= videoFile.positionStart &&
                currentTimeSeconds <= videoFile.positionEnd;

            if (isActive) {
                // This video should be playing
                if (video.readyState >= video.HAVE_CURRENT_DATA) {
                    if (video.paused) {
                        // Start playing at the correct time
                        const videoTime = videoFile.startTime + (currentTimeSeconds - videoFile.positionStart);
                        video.currentTime = videoTime;
                        video.muted = isMuted;
                        video.play().catch(console.error);
                    }

                    // Only draw the first active video
                    if (firstActiveVideoIndex === -1) {
                        firstActiveVideoIndex = index;

                        // Calculate video position and size
                        const videoAspect = video.videoWidth / video.videoHeight;
                        const canvasAspect = width / height;

                        let drawWidth = width;
                        let drawHeight = height;
                        let offsetX = 0;
                        let offsetY = 0;

                        if (videoAspect > canvasAspect) {
                            drawHeight = width / videoAspect;
                            offsetY = (height - drawHeight) / 2;
                        } else {
                            drawWidth = height * videoAspect;
                            offsetX = (width - drawWidth) / 2;
                        }

                        // Draw video frame
                        ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
                    }
                }
                allVideosEnded = false;
            } else {
                // Not active - make sure it's paused
                video.pause();
                // Reset to start position if we're before this video's start time
                if (currentTimeSeconds < videoFile.positionStart) {
                    video.currentTime = videoFile.startTime;
                }
            }
        });

        animationFrameRef.current = requestAnimationFrame(drawFrame);
    };

    useEffect(() => {
    }, [currentTime]);

    // Toggle play/pause
    const togglePlay = () => {
        if (!isPlaying) {
            // If we're at the end, reset to start
            if (currentTime >= duration) {
                const newTime = 0;
                setCurrentTime(newTime);
                startTimeRef.current = performance.now();
                // Reset all videos to their start positions
                videoFiles.forEach((videoFile, index) => {
                    const video = videoElementsRef.current[index];
                    if (video) {
                        video.currentTime = videoFile.startTime;
                    }
                });
            } else {
                // Otherwise, continue from current position
                startTimeRef.current = performance.now() - (currentTime * 1000);
            }

            // Start the animation frame
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            animationFrameRef.current = requestAnimationFrame(drawFrame);
        } else {
            // Pause all videos and stop animation
            if (animationFrameRef.current) {
                videoElementsRef.current.forEach(video => video.pause());
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        }
        setIsPlaying(!isPlaying);
    };

    // Toggle mute
    const toggleMute = () => {
        setIsMuted(!isMuted);
        videoElementsRef.current.forEach(video => {
            video.muted = !isMuted;
        });
    };

    // Toggle playback speed for a specific video
    const togglePlaybackSpeed = (index: number) => {
        const speeds = [1, 1.5, 2, 0.5];
        const currentSpeed = playbackSpeeds[index];
        const currentIndex = speeds.indexOf(currentSpeed);
        const nextIndex = (currentIndex + 1) % speeds.length;
        const newSpeed = speeds[nextIndex];

        setPlaybackSpeeds(prev => {
            const newSpeeds = [...prev];
            newSpeeds[index] = newSpeed;
            return newSpeeds;
        });

        const video = videoElementsRef.current[index];
        if (video) {
            video.playbackRate = newSpeed;
        }
    };

    useEffect(() => {
        initCanvas();
        setupVideos();

        animationFrameRef.current = requestAnimationFrame(drawFrame);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            videoElementsRef.current.forEach(video => {
                video.pause();
                URL.revokeObjectURL(video.src);
            });
        };
    }, [videoFiles, isMuted]);

    return (
        <div className="relative">
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                style={{ width: '100%', height: 'auto' }}
                className="border border-gray-300 rounded"
            />
            <div className="absolute bottom-2 right-2 flex space-x-2">
                <button
                    onClick={toggleMute}
                    className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-3 rounded"
                >
                    {isMuted ? '🔇' : '🔊'}
                </button>
                <button
                    onClick={togglePlay}
                    className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded"
                >
                    {isPlaying ? '⏸️' : '▶️'}
                </button>
            </div>

            {/* Video speed controls */}
            <div className="absolute bottom-2 left-2 flex flex-col space-y-2">
                {videoFiles.map((videoFile, index) => (
                    <button
                        key={index}
                        onClick={() => togglePlaybackSpeed(index)}
                        className="bg-green-500 hover:bg-green-700 text-white py-1 px-3 rounded"
                    >
                        Video {index + 1}: {playbackSpeeds[index]}x
                    </button>
                ))}
            </div>

            {/* Timeline */}
            <div className="mt-2">
                <div
                    ref={timelineRef}
                    className="relative h-2 bg-gray-300 rounded-full cursor-pointer"
                    onClick={handleTimelineClick}
                >
                    <div
                        className="absolute h-full bg-blue-500 rounded-full"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>
        </div>
    );
} 