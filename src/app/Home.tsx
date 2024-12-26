'use client'

import React from 'react';
import { fetchFile } from "@ffmpeg/util";
import { useFFmpeg } from './hooks';
import { saveFile } from './utils';

export default function Home() {
  const { ffmpeg, ensureFFmpegLoaded, loading, error } = useFFmpeg();

  const handleFiles = (files: FileList) => {
    const _handleFiles = async () => {
      await ensureFFmpegLoaded();
      for (const file of files)
        await ffmpeg.writeFile(file.name, await fetchFile(file));
      const textContent = Array.from(files).map((file) => `file '${file.name}'`).join('\n');
      await ffmpeg.writeFile('text.txt', textContent);
      await ffmpeg.exec(['-f', 'concat', '-i', 'text.txt', '-c', 'copy', 'output.mp4']);
      const data = await ffmpeg.readFile("output.mp4");
      saveFile(new Blob([data], { type: "video/mp4" }), 'test.mp4');
    };
    _handleFiles().catch(console.error);
  };

  if (loading)
    return <p>loading...</p>;

  if (error)
    return <p>{error.message}</p>;

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
