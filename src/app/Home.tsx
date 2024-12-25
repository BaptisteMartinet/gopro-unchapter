'use client'

import React from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from "@ffmpeg/util";

type AsyncStatus = 'uninitialized' | 'pending' | 'success' | 'rejected';

function useAsyncStatus() {
  const [status, setStatus] = React.useState<AsyncStatus>('uninitialized');

  const track = (promise: Promise<unknown>) => {
    setStatus('pending');
    promise.then(() => setStatus('success')).catch(() => setStatus('rejected'));
  };

  return [status, track] as const;
}

function saveFile(blob: Blob, filename: string) {
  const blobURL = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = blobURL;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  URL.revokeObjectURL(blobURL);
}

const FFmpegBaseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";

export default function Home() {
  const [ffmpeg] = React.useState(() => new FFmpeg());
  const [ffmpegStatus, trackFFmpegStatus] = useAsyncStatus();

  const loadFFmpeg = () => {
    const _loadFFmpeg = async () => {
      ffmpeg.on('log', ({ type, message }) => {
        console.log(`${type}: ${message}`);
      });
      await ffmpeg.load({
        coreURL: await toBlobURL(`${FFmpegBaseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${FFmpegBaseURL}/ffmpeg-core.wasm`, "application/wasm"),
      })
    };
    trackFFmpegStatus(_loadFFmpeg());
  };

  const handleFiles = (files: FileList) => {
    const _handleFiles = async () => {
      for (const file of files)
        await ffmpeg.writeFile(file.name, await fetchFile(file));
      const textContent = Array.from(files).map((file) => `file '${file.name}'`).join('\n');
      console.log(textContent);
      await ffmpeg.writeFile('text.txt', textContent);
      await ffmpeg.exec(['-f', 'concat', '-i', 'text.txt', '-c', 'copy', 'output.mp4']);
      const data = await ffmpeg.readFile("output.mp4");
      saveFile(new Blob([data], { type: "video/mp4" }), 'test.mp4');
    };
    _handleFiles().catch(console.error);
  };

  if (ffmpegStatus === 'rejected')
    return <p>error</p>;

  if (ffmpegStatus === 'success') {
    return (
      <input
        type="file"
        accept="video/*"
        multiple
        onChange={(event) => {
          const files = event.target.files;
          if (!files)
            return;
          handleFiles(files);
        }} />
    );
  }
  return <button onClick={loadFFmpeg}>Load FFmpeg</button>;
}

// "use client";

// import { FFmpeg } from "@ffmpeg/ffmpeg";
// import { fetchFile, toBlobURL } from "@ffmpeg/util";
// import { useRef, useState } from "react";

// export default function Home() {
//   const [loaded, setLoaded] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const ffmpegRef = useRef(new FFmpeg());
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const messageRef = useRef<HTMLParagraphElement | null>(null);

//   const load = async () => {
//     setIsLoading(true);
//     const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
//     const ffmpeg = ffmpegRef.current;
//     ffmpeg.on("log", ({ message }) => {
//       if (messageRef.current) messageRef.current.innerHTML = message;
//     });
//     // toBlobURL is used to bypass CORS issue, urls with the same
//     // domain can be used directly.
//     await ffmpeg.load({
//       coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
//       wasmURL: await toBlobURL(
//         `${baseURL}/ffmpeg-core.wasm`,
//         "application/wasm"
//       ),
//     });
//     setLoaded(true);
//     setIsLoading(false);
//   };

//   const transcode = async () => {
//     const ffmpeg = ffmpegRef.current;
//     // u can use 'https://ffmpegwasm.netlify.app/video/video-15s.avi' to download the video to public folder for testing
//     await ffmpeg.writeFile(
//       "input.avi",
//       await fetchFile(
//         "https://raw.githubusercontent.com/ffmpegwasm/testdata/master/video-15s.avi"
//       )
//     );
//     await ffmpeg.exec(["-i", "input.avi", "output.mp4"]);
//     const data = await ffmpeg.readFile("output.mp4");
//     if (videoRef.current)
//       videoRef.current.src = URL.createObjectURL(
//         new Blob([data], { type: "video/mp4" })
//       );
//   };

//   return loaded ? (
//     <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
//       <video ref={videoRef} controls></video>
//       <br />
//       <button
//         onClick={transcode}
//         className="bg-green-500 hover:bg-green-700 text-white py-3 px-6 rounded"
//       >
//         Transcode avi to mp4
//       </button>
//       <p ref={messageRef}></p>
//     </div>
//   ) : (
//     <button
//       className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex items-center bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
//       onClick={load}
//     >
//       Load ffmpeg-core
//       {isLoading && (
//         <span className="animate-spin ml-3">
//           <svg
//             viewBox="0 0 1024 1024"
//             focusable="false"
//             data-icon="loading"
//             width="1em"
//             height="1em"
//             fill="currentColor"
//             aria-hidden="true"
//           >
//             <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path>
//           </svg>
//         </span>
//       )}
//     </button>
//   );
// }
