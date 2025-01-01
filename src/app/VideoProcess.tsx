import React from 'react';
import assert from 'assert';
import { FileWithPath } from '@mantine/dropzone';
import { fetchFile } from "@ffmpeg/util";
import { BlobReader, BlobWriter, ZipWriter } from '@zip.js/zip.js';
import { indexMultipleArrayItems } from '@/utils/array';
import { parseGoproFilename } from '@/utils/gopro';
import { useFFmpeg } from '@/hooks';
import DropZone from './DropZone';
import ProcessingProgress from './ProcessingProgress';
import ProcessingResult from './ProcessingResult';
import ProcessingError from './ProcessingError';

type LogingState =
  | { status: 'initial' }
  | { status: 'processing', step: number, steps: number, message: string }
  | { status: 'finished', zipURL: string }
  | { status: 'error', message: string }

type ActionType =
  | { type: 'initProcessing', steps: number, message: string }
  | { type: 'increaseStep', message?: string }
  | { type: 'finish', zipURL: string }
  | { type: 'error', message: string }
  | { type: 'reset' }

function stepReducer(state: LogingState, action: ActionType): LogingState {
  switch (action.type) {
    case 'initProcessing': return { status: 'processing', step: 1, steps: action.steps, message: action.message };
    case 'increaseStep': {
      assert(state.status === 'processing');
      return { ...state, step: state.step + 1, message: action.message ?? state.message };
    }
    case 'finish': return { status: 'finished', zipURL: action.zipURL };
    case 'error': return { status: 'error', message: action.message };
    case 'reset': return { status: 'initial' };
  }
}

export default function VideoProcess() {
  const { ffmpeg, ensureFFmpegLoaded } = useFFmpeg();
  const [log, dispatchLog] = React.useReducer(stepReducer, { status: 'initial' });

  const handleFiles = (files: Array<FileWithPath>) => {
    const _handleFilesAsync = async () => {
      const filesWithInfo = files.map((file) => ({
        file,
        info: parseGoproFilename(file.name),
      }));
      const indexedFilesMap = indexMultipleArrayItems(filesWithInfo, ({ info }) => {
        const { type, encoding, chapter } = info;
        return `${type}:${encoding}:${chapter}`;
      });
      dispatchLog({ type: 'initProcessing', steps: 1 + indexedFilesMap.size * 4, message: 'Loading libraries' });
      await ensureFFmpegLoaded();

      const zipFileWriter = new BlobWriter();
      const zipWriter = new ZipWriter(zipFileWriter);

      let idx = 0;
      for (const indexedFiles of indexedFilesMap.values()) {
        dispatchLog({ type: 'increaseStep', message: `Generating clips ${idx + 1}/${indexedFilesMap.size}` });
        const sortedFiles = indexedFiles.sort((lhs, rhs) => lhs.info.fileNumber - rhs.info.fileNumber);
        for (const file of sortedFiles)
          await ffmpeg.writeFile(file.file.name, await fetchFile(file.file));
        const copyContentText = sortedFiles.map(({ file }) => `file '${file.name}'`).join('\n');
        await ffmpeg.writeFile('copyContent.txt', copyContentText);
        dispatchLog({ type: 'increaseStep' });
        await ffmpeg.exec(['-f', 'concat', '-safe', '0', '-i', 'copyContent.txt', '-c', 'copy', 'output.mp4']);
        dispatchLog({ type: 'increaseStep' });
        const data = await ffmpeg.readFile("output.mp4");
        const indexInfo = sortedFiles[0].info;
        const chapterFilename = `${indexInfo.chapter}.mp4`;
        zipWriter.add(chapterFilename, new BlobReader(new Blob([data], { type: "video/mp4" })));
        dispatchLog({ type: 'increaseStep' });
        await ffmpeg.deleteFile('output.mp4');
        await ffmpeg.deleteFile('copyContent.txt');
        for (const file of sortedFiles)
          await ffmpeg.deleteFile(file.file.name);
        idx += 1;
      }
      const zipBlob = await zipWriter.close();
      const zipURL = URL.createObjectURL(zipBlob);
      dispatchLog({ type: 'finish', zipURL });
    };

    if (files.length < 2)
      return dispatchLog({ type: 'error', message: 'At least two files must be uploaded' });
    _handleFilesAsync().catch((error) => {
      const message = error instanceof Error ? error.message : 'Unknown error';
      dispatchLog({ type: 'error', message });
    });
  };

  if (log.status === 'initial')
    return <DropZone onDrop={(files) => handleFiles(files)} />;
  if (log.status === 'processing')
    return <ProcessingProgress step={log.step} steps={log.steps} message={log.message} />;
  if (log.status === 'error')
    return <ProcessingError message={log.message} onReset={() => dispatchLog({ type: 'reset' })} />
  return <ProcessingResult zipURL={log.zipURL} onReset={() => dispatchLog({ type: 'reset' })} />;
}
