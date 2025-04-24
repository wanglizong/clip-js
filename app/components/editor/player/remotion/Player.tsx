import { Player, PlayerRef } from "@remotion/player";
import Composition from "./sequence/composition";
import { useAppSelector, useAppDispatch } from "@/app/store";
import { useRef, useState } from "react";


const calculateFrames = (
    display: { from: number; to: number },
    fps: number
) => {
    const from = (display.from / 1000) * fps;
    const durationInFrames = (display.to / 1000) * fps - from;
    return { from, durationInFrames };
};

const fps = 30;

export const PreviewPlayer = () => {
    const projectState = useAppSelector((state) => state.projectState);
    const { duration } = projectState;
    const playerRef = useRef<PlayerRef>(null);

    // TODO: this when clicking timeline header but is not used now
    // useEffect(() => {
    //     const frame = Math.round(currentTime * fps);
    //     if (playerRef.current) {
    //         playerRef.current.seekTo(frame);
    //     }
    // }, [currentTime, fps]);

    return (
        <Player
            ref={playerRef}
            component={Composition}
            inputProps={{}}
            durationInFrames={Math.round(duration * fps) + 1}
            compositionWidth={1920}
            compositionHeight={1080}
            fps={fps}
            style={{ width: "100%", height: "100%" }}
            controls
        />
    )
};