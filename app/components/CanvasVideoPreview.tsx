"use client";

import { useEffect, useRef } from 'react';
import { MediaFile as VideoFile } from '../types';
import { useAppSelector, useAppDispatch } from '../store';
import { setCurrentTime, setIsPlaying, setIsMuted, setPlaybackSpeed, setVideoFiles } from '../store/slices/videoSlice';
import { formatTime } from '../utils/utils';

interface CanvasVideoPreviewProps {
    videoFiles: VideoFile[];
    width?: number;
    height?: number;
}

export default function CanvasVideoPreview({
    videoFiles: passedVideoFiles,
    width = 640,
    height = 360
}: CanvasVideoPreviewProps) {
    const dispatch = useAppDispatch();
    const { currentTime, isPlaying, isMuted, duration, playbackSpeeds, videoFiles } = useAppSelector((state) => state.video);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const videoElementsRef = useRef<HTMLVideoElement[]>([]);
    const audioElementsRef = useRef<HTMLAudioElement[]>([]);
    const animationFrameRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);
    const timelineRef = useRef<HTMLDivElement>(null);
    const isFirstRun = useRef(true);

    // Create mappings for video and audio elements
    const videoIndexMap = useRef<number[]>([]);
    const audioIndexMap = useRef<number[]>([]);

    // Handle timeline click
    const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!timelineRef.current) return;

        const rect = timelineRef.current.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        const percentage = clickPosition / rect.width;
        const newTime = percentage * duration;

        videoIndexMap.current.forEach((fileIndex, elementIndex) => {
            const mediaFile = videoFiles[fileIndex];
            const video = videoElementsRef.current[elementIndex];
            // // Update all videos
            if (!video) return;

            if (newTime >= mediaFile.positionStart && newTime <= mediaFile.positionEnd) {
                const videoTime = mediaFile.startTime + (newTime - mediaFile.positionStart);
                video.currentTime = videoTime;
            } else {
                video.pause();
                if (newTime < mediaFile.positionStart) {
                    video.currentTime = mediaFile.startTime;
                }
            }
        })


        audioIndexMap.current.forEach((fileIndex, elementIndex) => {
            const mediaFile = videoFiles[fileIndex];
            const audio = audioElementsRef.current[elementIndex];
            if (!audio) return;

            if (newTime >= mediaFile.positionStart && newTime <= mediaFile.positionEnd) {
                audio.currentTime = mediaFile.startTime + (newTime - mediaFile.positionStart);
            }
            else {
                audio.pause();
                if (newTime < mediaFile.positionStart) {
                    audio.currentTime = mediaFile.startTime;
                }
            }
        })
        startTimeRef.current = performance.now() - (newTime * 1000);
        dispatch(setCurrentTime(newTime));
    }


    useEffect(() => {
        dispatch(setVideoFiles(passedVideoFiles));
    }, [dispatch, passedVideoFiles]);

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
        // Clear existing videos and audio
        videoElementsRef.current.forEach(video => {
            video.pause();
            video.src = '';
        });
        audioElementsRef.current.forEach(audio => {
            audio.pause();
            audio.src = '';
        });
        videoElementsRef.current = [];
        audioElementsRef.current = [];
        videoIndexMap.current = [];
        audioIndexMap.current = [];

        // Create new video and audio elements
        videoFiles.forEach((mediaFile, index) => {
            if (mediaFile.type === 'video') {
                const video = document.createElement('video');
                video.src = URL.createObjectURL(mediaFile.file);
                video.loop = true;
                video.muted = isMuted;
                video.playsInline = true;
                video.preload = 'auto';
                video.playbackRate = playbackSpeeds[index] || 1;
                video.volume = mediaFile.volume;
                videoElementsRef.current.push(video);
                videoIndexMap.current.push(index);

                video.addEventListener('loadedmetadata', () => {
                    video.currentTime = mediaFile.startTime;
                });
            } else if (mediaFile.type === 'audio') {
                const audio = document.createElement('audio');
                audio.src = URL.createObjectURL(mediaFile.file);
                audio.loop = true;
                audio.muted = isMuted;
                audio.preload = 'auto';
                audio.volume = mediaFile.volume;
                audio.playbackRate = playbackSpeeds[index] || 1;
                audioElementsRef.current.push(audio);
                audioIndexMap.current.push(index);

                audio.addEventListener('loadedmetadata', () => {
                    audio.currentTime = mediaFile.startTime;
                });
            }
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
            dispatch(setIsPlaying(false));
            dispatch(setCurrentTime(duration));
            videoElementsRef.current.forEach(video => {
                video.pause();
                video.currentTime = video.duration;
            });
            audioElementsRef.current.forEach(audio => {
                audio.pause();
                audio.currentTime = audio.duration;
            });
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
            return;
        }

        dispatch(setCurrentTime(currentTimeSeconds));

        // Clear canvas
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, width, height);

        // Handle video elements
        videoIndexMap.current.forEach((fileIndex, elementIndex) => {
            const mediaFile = videoFiles[fileIndex];
            const video = videoElementsRef.current[elementIndex];
            if (!video) return;

            const isActive = currentTimeSeconds >= mediaFile.positionStart &&
                currentTimeSeconds <= mediaFile.positionEnd;

            if (isActive) {
                if (video.readyState >= video.HAVE_CURRENT_DATA) {
                    if (video.paused) {
                        const videoTime = mediaFile.startTime + (currentTimeSeconds - mediaFile.positionStart);
                        video.currentTime = videoTime;
                        video.muted = isMuted;
                        video.play().catch(console.error);
                    }

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

                    ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
                }
            } else {
                video.pause();
                if (currentTimeSeconds < mediaFile.positionStart) {
                    video.currentTime = mediaFile.startTime;
                }
            }
        });

        // Handle audio elements
        audioIndexMap.current.forEach((fileIndex, elementIndex) => {
            const mediaFile = videoFiles[fileIndex];
            const audio = audioElementsRef.current[elementIndex];
            if (!audio) return;

            const isActive = currentTimeSeconds >= mediaFile.positionStart &&
                currentTimeSeconds <= mediaFile.positionEnd;

            if (isActive) {
                if (audio.readyState >= audio.HAVE_CURRENT_DATA) {
                    if (audio.paused) {
                        const audioTime = mediaFile.startTime + (currentTimeSeconds - mediaFile.positionStart);
                        audio.currentTime = audioTime;
                        audio.muted = isMuted;
                        audio.play().catch(console.error);
                    }
                }
            } else {
                audio.pause();
                if (currentTimeSeconds < mediaFile.positionStart) {
                    audio.currentTime = mediaFile.startTime;
                }
            }
        });
        // TODO: For Now Cause There is a bug here where the animation frame is being requested when the video is not playing
        if (!isPlaying && !isFirstRun.current) {
            animationFrameRef.current = requestAnimationFrame(drawFrame);
        }
    };

    const togglePlay = () => {
        isFirstRun.current = false;
        if (!isPlaying) {
            // If we're at the end, reset to start
            if (currentTime >= duration) {
                const newTime = 0;
                dispatch(setCurrentTime(newTime));
                startTimeRef.current = performance.now();
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
                audioElementsRef.current.forEach(audio => audio.pause());
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        }
        dispatch(setIsPlaying(!isPlaying));
    };

    // Toggle mute
    const toggleMute = () => {
        dispatch(setIsMuted(!isMuted));
        videoElementsRef.current.forEach(video => {
            video.muted = !isMuted;
        });
        audioElementsRef.current.forEach(audio => {
            audio.muted = !isMuted;
        });
    };

    // Toggle playback speed for a specific video
    const togglePlaybackSpeed = (index: number) => {
        const speeds = [1, 1.5, 2, 0.5];
        const currentSpeed = playbackSpeeds[index];
        const currentIndex = speeds.indexOf(currentSpeed);
        const nextIndex = (currentIndex + 1) % speeds.length;
        const newSpeed = speeds[nextIndex];
        dispatch(setPlaybackSpeed({ index, speed: newSpeed }));

        const video = videoElementsRef.current[index];
        if (video) {
            video.playbackRate = newSpeed;
        }
        const audio = audioElementsRef.current[index];
        if (audio) {
            audio.playbackRate = newSpeed;
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
            audioElementsRef.current.forEach(audio => {
                audio.pause();
                URL.revokeObjectURL(audio.src);
            });
            dispatch(setIsPlaying(false));
        };
    }, [videoFiles]);

    return (
        <div className="relative">
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                style={{ width: '100%', height: 'auto' }}
                className="border border-gray-300 rounded"
            />
            {/* <CanvasSoundPreview /> */}
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
                    {isPlaying ? 'true▶️' : 'false⏸️'}
                </button>
            </div>

            {/* Video speed controls */}
            <div className="absolute bottom-8 left-2 flex flex-col space-y-2">
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