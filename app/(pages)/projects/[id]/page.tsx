"use client";
import { useEffect } from "react";
import { getFile, storeProject, useAppDispatch, useAppSelector } from "../../../store";
import { getProject } from "../../../store";
import { setCurrentProject, updateProject } from "../../../store/slices/projectsSlice";
import { rehydrate, setMediaFiles } from '../../../store/slices/projectSlice';
import { setActiveSection } from "../../../store/slices/projectSlice";
// import CanvasPreview from "../../../components/editor/player/CanvasPreview";
import AddText from '../../../components/editor/AssetsPanel/AddButtons/AddText';
import AddMedia from '../../../components/editor/AssetsPanel/AddButtons/UploadMedia';
import MediaList from '../../../components/editor/AssetsPanel/MediaList';
import { useRouter } from 'next/navigation';
import TextButton from "@/app/components/editor/AssetsPanel/SidebarButtons/TextButton";
import LibraryButton from "@/app/components/editor/AssetsPanel/SidebarButtons/LibraryButton";
import ExportButton from "@/app/components/editor/AssetsPanel/SidebarButtons/ExportButton";
import MediaProperties from "../../../components/editor/PropertiesSection/MediaProperties";
import TextProperties from "../../../components/editor/PropertiesSection/TextProperties";
import { Timeline } from "../../../components/editor/timeline/Timline";
// import RemotionPreview from "../../../components/editor/player/RemotionPreview";
import { PreviewPlayer } from "../../../components/editor/player/remotion/Player";
import { MediaFile } from "@/app/types";

export default function Project({ params }: { params: { id: string } }) {
    const { id } = params;
    const dispatch = useAppDispatch();
    const projectState = useAppSelector((state) => state.projectState);
    const { currentProjectId } = useAppSelector((state) => state.projects);

    const router = useRouter();
    const { activeSection, activeElement } = projectState;
    // when page is loaded set the project id if it exists
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

    // set project state from with the current project id
    useEffect(() => {
        const loadProject = async () => {
            if (currentProjectId) {
                const project = await getProject(currentProjectId);
                if (project) {
                    dispatch(rehydrate(project));

                    dispatch(setMediaFiles(await Promise.all(
                        project.mediaFiles.map(async (media: MediaFile) => {
                            const file = await getFile(media.fileId);
                            return { ...media, src: URL.createObjectURL(file) };
                        })
                    )));
                }
            }
        };
        loadProject();
    }, [dispatch, currentProjectId]);


    // save
    useEffect(() => {
        const saveProject = async () => {
            if (!projectState) return;
            await storeProject(projectState);
            dispatch(updateProject(projectState));
        };
        saveProject();
    }, [projectState, dispatch]);


    const handleFocus = (section: "media" | "text" | "export") => {
        dispatch(setActiveSection(section));
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar - Buttons */}
                <div className="flex-[0.1] min-w-[60px] max-w-[100px] border-r border-gray-700 overflow-y-auto p-4">
                    <div className="flex flex-col  space-y-2">
                        <TextButton onClick={() => handleFocus("text")} />
                        <LibraryButton onClick={() => handleFocus("media")} />
                        <ExportButton onClick={() => handleFocus("export")} />
                    </div>
                </div>

                {/* Add media and text */}
                <div className="flex-[0.3] min-w-[200px] border-r border-gray-800 overflow-y-auto p-4">
                    {activeSection === "media" && (
                        <div>
                            <h2 className="text-lg flex flex-row gap-2 items-center justify-center font-semibold mb-2">
                                <AddMedia />
                            </h2>
                            <MediaList />
                        </div>
                    )}
                    {activeSection === "text" && (
                        <div>
                            <AddText />
                        </div>
                    )}
                </div>

                {/* Center - Video Preview */}
                <div className="flex items-center justify-center flex-[1] overflow-hidden">
                    <PreviewPlayer />
                </div>

                {/* Right Sidebar - Element Properties */}
                <div className="flex-[0.4] min-w-[200px] border-l border-gray-800 overflow-y-auto p-4">
                    {activeElement === "media" && (
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Media Properties</h2>
                            <MediaProperties />
                        </div>
                    )}
                    {activeElement === "text" && (
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Text Properties</h2>
                            <TextProperties />
                        </div>
                    )}
                </div>
            </div>
            {/* Timeline at bottom */}
            <div className="flex-[0.4] border-t border-gray-500">
                <Timeline />
            </div>
        </div>
    );
}
