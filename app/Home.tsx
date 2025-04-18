"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const messageRef = useRef<HTMLParagraphElement | null>(null);
  const [start, setStart] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [end, setEnd] = useState(5);
  const load = async () => {
    // const isAlreadyLoaded = localStorage.getItem("ffmpegLoaded");
    // console.log("checking if ffmpeg is already loaded");
    // if (isAlreadyLoaded == "true") {
    //   console.log("FFmpeg is already loaded.");
    //   setLoaded(true);
    //   return;
    // }
    setIsLoading(true);
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on("log", ({ message }) => {
      if (messageRef.current) messageRef.current.innerHTML = message;
    });
    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
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
    load(); // Automatically execute load when the component mounts
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const url = URL.createObjectURL(f);
      if (videoRef.current) {
        videoRef.current.src = url;
      }
    }
  };

  const transcode = async () => {
    if (!file || end <= start) return;

    const ffmpeg = ffmpegRef.current;
    // u can use 'https://ffmpegwasm.netlify.app/video/video-15s.avi' to download the video to public folder for testing
    console.log("before write");
    await ffmpeg.writeFile(
      "input.mp4",
      await fetchFile(file)
    );
    const duration = end - start;


    await ffmpeg.exec([
      "-i", "input.mp4",
      "-ss", start.toString(),
      "-t", duration.toString(),
      "-c", "copy", // copy to avoid re-encoding
      "output.mp4"
    ]);

    console.log("after write");
    console.log("FFmpeg loaded:", ffmpegRef.current);

    try {
      // await ffmpeg.exec(["-i", "input.avi", "output.mp4"]);
      console.log("after exec");
      const data = (await ffmpeg.readFile("output.mp4")) as any;
      if (videoRef.current)
        videoRef.current.src = URL.createObjectURL(
          new Blob([data.buffer], { type: "video/mp4" })
        );
    } catch (e) {
      console.error("Transcoding failed:", e);
      if (messageRef.current)
        messageRef.current.innerText = `Transcoding failed: ${e}`;
    }
  };

  return loaded ? (
    <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      <div className="space-x-2">
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

      <input
        type="file"
        accept="video/*"
        onChange={(e) => { handleFileChange(e) }}
        className="my-4"
      />
      <video ref={videoRef} controls></video>
      <br />
      <button
        onClick={transcode}
        className="bg-green-500 hover:bg-green-700 text-white py-3 px-6 rounded"
      >
        trim
      </button>
      <p ref={messageRef}></p>
    </div>
  ) : (
    <button
      className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex items-center bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
      onClick={load}
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
    </button>
  );
}
