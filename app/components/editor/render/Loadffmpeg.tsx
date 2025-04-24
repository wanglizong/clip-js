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
