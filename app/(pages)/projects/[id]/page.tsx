"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { MediaFile } from "../../../types";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getProject, storeProject } from "../../../store";
import { setCurrentProject, updateProject } from "../../../store/slices/projectsSlice";
import { rehydrate } from "../../../store/slices/projectSlice";
import CanvasVideoPreview from "../../../components/editor/CanvasVideoPreview";
import AddTextButton from '../../../components/buttons/AddText';
import UploadFile from '../../../components/buttons/UploadFile';
import TextList from '../../../components/editor/TextList';
import MediaList from '../../../components/editor/MediaList';

export default function Project({ params }: { params: { id: string } }) {
    const { id } = params;
    const dispatch = useAppDispatch();
    const [loaded, setLoaded] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const ffmpegRef = useRef(new FFmpeg());
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const messageRef = useRef<HTMLParagraphElement | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<MediaFile[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const projectState = useAppSelector((state) => state.projectState);

    // const loadFFmpeg = async () => {
    //     setIsLoading(true);
    //     const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";
    //     const ffmpeg = ffmpegRef.current;
    //     ffmpeg.on("log", ({ message }) => {
    //         if (messageRef.current) messageRef.current.innerHTML = message;
    //     });
    //     await ffmpeg.load({
    //         coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    //         wasmURL: await toBlobURL(
    //             `${baseURL}/ffmpeg-core.wasm`,
    //             "application/wasm"
    //         ),
    //     });
    //     setLoaded(true);
    //     localStorage.setItem("ffmpegLoaded", "true");
    //     setIsLoading(false);
    // };

    // useEffect(() => {
    //     loadFFmpeg();
    // }, []);

    // when page is loaded
    useEffect(() => {
        if (id)
            dispatch(setCurrentProject(id));
    }, [id, dispatch]);

    return (
        <div className="space-y-4 p-200">
            <UploadFile />
            <AddTextButton />
            <CanvasVideoPreview />
            {/* TODO: separate list and edit menu for both */}
            <MediaList />
            <TextList />
        </div>
    );
}
