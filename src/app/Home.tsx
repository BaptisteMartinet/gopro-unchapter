'use client'

import React from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useAsyncStatus } from './hooks';
import { saveFile } from './utils';

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

  if (ffmpegStatus === 'fulfilled') {
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
