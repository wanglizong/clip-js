import { storeProject, useAppDispatch, useAppSelector } from "@/app/store";
import { SequenceItem } from "./sequence-item";
import { MediaFile } from "@/app/types";
import { useEffect } from "react";
import { updateProject } from "@/app/store/slices/projectsSlice";



const Composition = () => {
    const projectState = useAppSelector((state) => state.projectState);
    const { mediaFiles } = projectState;



    const fps = 30;
    return (
        <>
            {mediaFiles
                .map((item: MediaFile) => {
                    if (!item) return;
                    const trackItem = {
                        ...item,
                    } as MediaFile;
                    return SequenceItem[trackItem.type](trackItem, {
                        fps
                    });
                })}
        </>
    );
};

export default Composition;
