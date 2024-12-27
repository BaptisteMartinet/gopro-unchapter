import { useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import { useAsyncHandler } from "./useAsyncHandler";

const FFmpegBaseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";

export function useFFmpeg() {
  const [ffmpeg] = useState(() => new FFmpeg());
  const [ffmpegLoadStatus, loadFFmpeg] = useAsyncHandler(async () => {
    await ffmpeg.load({
      coreURL: await toBlobURL(
        `${FFmpegBaseURL}/ffmpeg-core.js`,
        "text/javascript"
      ),
      wasmURL: await toBlobURL(
        `${FFmpegBaseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });
  });
  const loading = ffmpegLoadStatus.status === "pending";
  const loaded = ffmpegLoadStatus.status === "fulfilled";
  const error =
    ffmpegLoadStatus.status === "rejected" ? ffmpegLoadStatus.error : null;

  const ensureFFmpegLoaded = async () => {
    if (ffmpegLoadStatus.status === "fulfilled") return;
    if (ffmpegLoadStatus.status === "pending") return ffmpegLoadStatus.promise;
    return loadFFmpeg();
  };

  return {
    ffmpeg,
    loading,
    loaded,
    error,
    ensureFFmpegLoaded,
  };
}
