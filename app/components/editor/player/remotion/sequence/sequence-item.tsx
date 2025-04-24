import { AbsoluteFill, OffthreadVideo, Sequence } from "remotion";
import { MediaFile } from "@/app/types";

const REMOTION_SAFE_FRAME = 0;

interface SequenceItemOptions {
    handleTextChange?: (id: string, text: string) => void;
    fps: number;
    editableTextId?: string | null;
    currentTime?: number;
}

const calculateFrames = (
    display: { from: number; to: number },
    fps: number
) => {
    const from = Math.round(display.from * fps);
    const to = Math.round(display.to * fps);
    const durationInFrames = Math.max(1, to - from);
    return { from, durationInFrames };
};

export const SequenceItem: Record<
    string,
    (item: MediaFile, options: SequenceItemOptions) => JSX.Element
> = {
    video: (item, options: SequenceItemOptions) => {
        const { fps } = options;

        const playbackRate = item.playbackSpeed || 1;
        const { from, durationInFrames } = calculateFrames(
            {
                from: item.positionStart / playbackRate,
                to: item.positionEnd / playbackRate
            },
            fps
        );

        // TODO: Add crop
        // const crop = item.crop || {
        //     x: 0,
        //     y: 0,
        //     width: item.width,
        //     height: item.height
        // };

        return (
            <Sequence
                key={item.id}
                from={from}
                durationInFrames={durationInFrames + REMOTION_SAFE_FRAME}
                style={{ pointerEvents: "none" }}
            >
                <AbsoluteFill
                    data-track-item="transition-element"
                    className={`designcombo-scene-item id-${item.id} designcombo-scene-item-type-${item.type}`}
                    style={{
                        pointerEvents: "auto",
                        top: item.x,
                        left: item.y,
                        width: item.width || "100%",
                        height: item.height || "auto",
                        transform: "none",
                        zIndex: item.zIndex,
                        opacity:
                            item?.opacity !== undefined
                                ? item.opacity / 100
                                : 1,
                        borderRadius: `10px`, // Default border radius
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            width: item.width || "100%",
                            height: item.height || "auto",
                            position: "relative",
                            overflow: "hidden",
                            pointerEvents: "none",
                        }}
                    >
                        <OffthreadVideo
                            startFrom={(item.startTime) * fps}
                            endAt={(item.endTime) * fps + REMOTION_SAFE_FRAME}
                            playbackRate={playbackRate}
                            src={item.src || ""}
                            volume={item.volume || 0 / 100}
                            style={{
                                pointerEvents: "none",
                                top: 0,
                                left: 0,
                                width: item.width || "100%", // Default width
                                height: item.height || "auto", // Default height
                                position: "absolute"
                            }}
                        />
                    </div>
                </AbsoluteFill>
            </Sequence>
        );
    },
};
