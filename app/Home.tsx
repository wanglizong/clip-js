"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useEffect, useRef, useState } from "react";
import FileUploader from "./components/FileUploader";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const messageRef = useRef<HTMLParagraphElement | null>(null);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(5);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on("log", ({ message }) => {
      if (messageRef.current) messageRef.current.innerHTML = message;
    });
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });
    setLoaded(true);
    localStorage.setItem("ffmpegLoaded", "true");
    setIsLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const trim = async () => {
    if (!previewUrl || end <= start) return;

    const ffmpeg = ffmpegRef.current;
    const response = await fetch(previewUrl);
    const blob = await response.blob();

    await ffmpeg.writeFile("input.mp4", await fetchFile(blob));
    const duration = end - start;

    await ffmpeg.exec([
      "-i", "input.mp4",
      "-ss", start.toString(),
      "-t", duration.toString(),
      "-c", "copy",
      "output.mp4"
    ]);

    try {
      const data = (await ffmpeg.readFile("output.mp4")) as any;
      if (videoRef.current)
        videoRef.current.src = URL.createObjectURL(
          new Blob([data.buffer], { type: "video/mp4" })
        );
    } catch (e) {
      console.error("Trimming failed:", e);
      if (messageRef.current)
        messageRef.current.innerText = `Trimming failed: ${e}`;
    }
  };

  return loaded ? (
    <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      <FileUploader
        onFilesChange={setSelectedFiles}
        selectedFiles={selectedFiles}
        onPreviewChange={setPreviewUrl}
        ffmpeg={ffmpegRef.current}
      />

      {previewUrl && (
        <>
          <div className="space-x-2 mt-4">
            <label>Start (s)</label>
            <input
              type="number"
              value={start}
              min={0}
              onChange={(e) => setStart(Number(e.target.value))}
              className="border p-1 w-20"
            />
            <label>End (s)</label>
            <input
              type="number"
              value={end}
              min={start}
              onChange={(e) => setEnd(Number(e.target.value))}
              className="border p-1 w-20"
            />
          </div>

          <video
            ref={videoRef}
            src={previewUrl}
            controls
            className="mt-4"
          ></video>

          <button
            onClick={trim}
            className="bg-green-500 hover:bg-green-700 text-white py-3 px-6 rounded mt-4 block"
          >
            Trim
          </button>
        </>
      )}
      <p ref={messageRef}></p>
    </div>
  ) : (
    <div
      className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex items-center bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
    >
      Load ffmpeg-core
      {isLoading && (
        <span className="animate-spin ml-3">
          <svg
            viewBox="0 0 1024 1024"
            focusable="false"
            data-icon="loading"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path>
          </svg>
        </span>
      )}
    </div>
  );
}
