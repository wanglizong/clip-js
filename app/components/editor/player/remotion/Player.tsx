import { Player, PlayerRef } from "@remotion/player";
import Composition from "./sequence/composition";
import { useAppSelector, useAppDispatch } from "@/app/store";
import { useRef, useState, useEffect } from "react";

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
            durationInFrames={Math.floor(duration * fps) + 1}
            compositionWidth={1920}
            compositionHeight={1080}
            fps={fps}
            style={{ width: "100%", height: "100%" }}
            controls
        />
    )
};