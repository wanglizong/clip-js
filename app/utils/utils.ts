import { MediaType } from "../types";
export const categorizeFile = (mimeType: string): MediaType => {

    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('image/')) return 'image';
    return 'unknown';
};