"use client";
import { FFmpeg } from "@ffmpeg/ffmpeg";
// import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useEffect, useRef, useState } from "react";
import { MediaFile } from "../../../types";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getProject, storeProject } from "../../../store";
import { setCurrentProject, updateProject } from "../../../store/slices/projectsSlice";
import { setActiveSection } from "../../../store/slices/projectSlice";
import CanvasVideoPreview from "../../../components/editor/CanvasVideoPreview";
import AddText from '../../../components/buttons/AddText';
import AddMedia from '../../../components/buttons/AddMedia';
import TextList from '../../../components/editor/TextList';
import MediaList from '../../../components/editor/MediaList';
import { useRouter } from 'next/navigation';
import TextButton from "@/app/components/buttons/TextButton";
import LibraryButton from "@/app/components/buttons/LibraryButton";

export default function Project({ params }: { params: { id: string } }) {
    const { id } = params;
    const dispatch = useAppDispatch();
    const [loaded, setLoaded] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    // const ffmpegRef = useRef(new FFmpeg());
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const messageRef = useRef<HTMLParagraphElement | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<MediaFile[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const projectState = useAppSelector((state) => state.projectState);
    const router = useRouter();
    // TODO: store active section on project states
    // const [activeSection, setActiveSection] = useState<"media" | "text" | null>("media"); // State to track active section
    const { activeSection } = projectState;
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
        const loadProject = async () => {
            if (id) {
                const project = await getProject(id);
                if (project) {
                    dispatch(setCurrentProject(id));
                } else {
                    router.push('/404');
                }
            }
        };
        loadProject();
    }, [id, dispatch]);

    const handleFocus = (section: "media" | "text") => {
        dispatch(setActiveSection(section)); // Update the active section
    };

    return (
        <div className="flex flex-col h-screen">
            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar - Buttons */}
                <div className="flex-[0.1] min-w-[60px] max-w-[100px] border-r overflow-y-auto p-4">
                    <div className="flex flex-col  space-y-2">
                        <TextButton onClick={() => handleFocus("text")} />
                        <LibraryButton onClick={() => handleFocus("media")} />
                    </div>
                </div>

                {/* Media List */}
                <div className="flex-[0.3] min-w-[200px] border-r overflow-y-auto p-4">
                    {activeSection === "media" && (
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Media</h2>
                            <MediaList />
                            <AddMedia />
                        </div>
                    )}
                    {activeSection === "text" && (
                        <div>
                            ]                            <TextList />
                            <AddText />
                        </div>
                    )}
                </div>

                {/* Center - Video Preview */}
                <div className="flex-[1] p-4 overflow-y-auto">
                    <div className="max-w-4xl mx-auto">
                        <CanvasVideoPreview />
                    </div>
                </div>
            </div>
        </div>
    );
}
