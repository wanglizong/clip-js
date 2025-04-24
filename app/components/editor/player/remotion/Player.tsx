import { Player } from "@remotion/player";
import Composition from "./sequence/composition";
import { Video, Sequence } from "remotion";
import { useAppSelector, useAppDispatch } from "@/app/store";
import { useCallback, useEffect } from "react";
import { setMediaFiles } from "@/app/store/slices/projectSlice";


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
    const dispatch = useAppDispatch();
    const { duration } = projectState;


    return (
        <Player
            component={Composition}
            inputProps={{}}
            durationInFrames={duration * fps + 1}
            compositionWidth={1920}
            compositionHeight={1080}
            fps={fps}
            style={{ width: "100%", height: "100%" }}
            controls
        />
    )
};