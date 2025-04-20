export type MediaType = 'video' | 'audio' | 'image' | 'unknown';

export interface MediaFile {
    file: File;
    type: MediaType;
    startTime: number;  // within the source video
    endTime: number;
    positionStart: number;  // position in the final video
    positionEnd: number;
    includeInMerge: boolean;
    playbackSpeed: number;
    volume: number;
    zIndex: number;

    // Optional visual settings
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    rotation?: number;
    opacity?: number;

    // Effects
    crop?: { x: number; y: number; width: number; height: number };

    // Runtime
    // elementRef?: HTMLVideoElement | HTMLImageElement | HTMLAudioElement;

}

export interface TextElement {
    id: string;
    text: string;                     // The actual text content

    // Timing
    positionStart: number;           // When text appears in final video
    positionEnd: number;             // When text disappears

    // Position & Size (canvas-based)
    x: number;
    y: number;
    width?: number;
    height?: number;

    // Styling
    font?: string;                   // Font family (e.g., 'Arial', 'Roboto')
    fontSize?: number;               // Font size in pixels
    color?: string;                  // Text color (hex or rgba)
    backgroundColor?: string;       // Background behind text
    align?: 'left' | 'center' | 'right'; // Horizontal alignment
    zIndex?: number;                 // Layering

    // Effects
    opacity?: number;                // Transparency (0 to 1)
    rotation?: number;               // Rotation in degrees
    fadeInDuration?: number;        // Seconds to fade in
    fadeOutDuration?: number;       // Seconds to fade out
    animation?: 'slide-in' | 'zoom' | 'bounce' | 'none'; // Optional animation

    // Runtime only (not persisted)
    visible?: boolean;              // Internal flag for rendering logic
}
