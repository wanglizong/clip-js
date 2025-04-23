"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getProject } from "../../../store";
import { setCurrentProject } from "../../../store/slices/projectsSlice";
import { setActiveSection } from "../../../store/slices/projectSlice";
import CanvasVideoPreview from "../../../components/editor/CanvasVideoPreview";
import AddText from '../../../components/buttons/AddText';
import AddMedia from '../../../components/buttons/AddMedia';
import MediaList from '../../../components/editor/MediaList';
import { useRouter } from 'next/navigation';
import TextButton from "@/app/components/buttons/TextButton";
import LibraryButton from "@/app/components/buttons/LibraryButton";
import ExportButton from "@/app/components/buttons/ExportButton";
import MediaProperties from "@/app/components/editor/MediaProperties";
import TextProperties from "../../../components/editor/TextProperties";
import { Timeline } from "../../../components/editor/timeline/Timline";

export default function Project({ params }: { params: { id: string } }) {
    const { id } = params;
    const dispatch = useAppDispatch();
    const projectState = useAppSelector((state) => state.projectState);
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

    const handleFocus = (section: "media" | "text" | "export") => {
        dispatch(setActiveSection(section));
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar - Buttons */}
                <div className="flex-[0.1] min-w-[60px] max-w-[100px] border-r overflow-y-auto p-4">
                    <div className="flex flex-col  space-y-2">
                        <TextButton onClick={() => handleFocus("text")} />
                        <LibraryButton onClick={() => handleFocus("media")} />
                        <ExportButton onClick={() => handleFocus("export")} />
                    </div>
                </div>

                {/* Add media and text */}
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

                {/* Right Sidebar - Element Properties */}
                <div className="flex-[0.4] min-w-[200px] border-l overflow-y-auto p-4">
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
            <div className="h-[450px] border-t">
                <Timeline />
            </div>
        </div>
    );
}
