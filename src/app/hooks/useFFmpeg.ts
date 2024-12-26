import { useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import { useAsyncStatus } from "./useAsyncStatus";

const FFmpegBaseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";

export function useFFmpeg() {
  const [ffmpeg] = useState(() => new FFmpeg());
  const [ffmpegLoadStatus, trackFFmpegLoadStatus] = useAsyncStatus();
  const loading = ffmpegLoadStatus.status === "pending";
  const loaded = ffmpegLoadStatus.status === "fulfilled";
  const error =
    ffmpegLoadStatus.status === "rejected" ? ffmpegLoadStatus.error : null;

  const ensureFFmpegLoaded = async () => {
    if (loaded) return;
    // TODO handle loading state
    const _loadFFmpeg = async () => {
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
    };
    const promise = _loadFFmpeg();
    trackFFmpegLoadStatus(promise);
    return promise;
  };

  return {
    ffmpeg,
    loading,
    loaded,
    error,
    ensureFFmpegLoaded,
  };
}
